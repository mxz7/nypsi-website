import { getRequestEvent, query } from "$app/server";
import { getEventData } from "$lib/functions/items";
import { RedisCache } from "$lib/server/cache";
import prisma from "$lib/server/database";
import {
  getEvent,
  getEventProgress,
  getPastEvents,
  getTotalUsers,
  getUserPosition,
} from "$lib/server/functions/event";
import { RedisPubSub } from "$lib/server/pubsub";
import redis from "$lib/server/redis";
import { error, redirect } from "@sveltejs/kit";
import z from "zod";
import { getAuthedUser } from "./auth.remote";

const EVENT_PROGRESS_CHANNEL = "nypsi:event-progress";

type EventProgressPoint = {
  createdAt: number;
  value: number;
};

const eventProgressHistoryCache = new RedisCache<EventProgressPoint[]>(
  "cache:events:progress-history",
  300,
);

export const getEventsData = query(() => getEventData(getRequestEvent().fetch));

export const getEventProgressHistory = query(z.number().int().positive(), async (eventId) => {
  const cached = await eventProgressHistoryCache.get(eventId.toString());
  if (cached) return cached;

  const history = await prisma.botMetrics.findMany({
    where: { category: `event_progress_${eventId}` },
    orderBy: { createdAt: "asc" },
    select: { createdAt: true, value: true },
  });

  const points =
    history.length >= 24
      ? history.map((point) => ({ createdAt: point.createdAt.getTime(), value: point.value }))
      : [];

  await eventProgressHistoryCache.set(eventId.toString(), points);
  return points;
});

export const getEventsPageData = query(async () => {
  const event = await getEvent();
  const [eventsData, pastEvents] = await Promise.all([
    getEventData(getRequestEvent().fetch),
    getPastEvents(),
  ]);

  if (!event) {
    return { eventsData, event: null, pastEvents };
  }

  const [authedUser, totalContribution] = await Promise.all([
    getAuthedUser(),
    getEventProgress(event.id, false),
  ]);
  const [userPosition, totalUsers] = authedUser
    ? await Promise.all([getUserPosition(event.id, authedUser.id), getTotalUsers(event.id)])
    : [undefined, undefined];

  return {
    eventsData,
    event,
    totalContribution: event.target
      ? Math.min(totalContribution, Number(event.target))
      : totalContribution,
    userPosition,
    totalUsers,
    pastEvents,
  };
});

export const getEventPageData = query(z.string(), async (eventId) => {
  const id = Number.parseInt(eventId);

  if (!id || Number.isNaN(id) || id < 0) {
    error(404, "event not found");
  }

  const event = await getEvent(id, true);

  if (!event) {
    error(404, "event not found");
  }

  if (!event.endedAt && (!event.expiresAt || new Date(event.expiresAt).getTime() > Date.now())) {
    redirect(302, "/events");
  }

  const [eventsData, authedUser, eventProgress] = await Promise.all([
    getEventData(getRequestEvent().fetch),
    getAuthedUser(),
    getEventProgress(event.id, true),
  ]);
  const [userPosition, totalUsers] = authedUser
    ? await Promise.all([getUserPosition(event.id, authedUser.id), getTotalUsers(event.id)])
    : [undefined, undefined];

  return {
    eventsData,
    event,
    totalContribution: event.target ? Math.min(eventProgress, Number(event.target)) : eventProgress,
    userPosition,
    totalUsers,
  };
});

type EventProgressEvent = {
  eventId: number;
  userId: string;
  userProgress: number;
  totalProgress: number;
};

export type EventProgressUpdate = {
  type: "update";
  totalProgress: number;
  userId?: string;
  userProgress?: number;
  user?: {
    avatar: string;
    lastKnownUsername: string;
  };
};

type EventProgressMessage = { type: "ready" } | EventProgressUpdate;

export const getEventUpdates = query.live(
  z.number().int().positive(),
  async function* (eventId): AsyncGenerator<EventProgressMessage> {
    const signal = getRequestEvent().request.signal;
    const pubsub = new RedisPubSub<EventProgressEvent>(redis, EVENT_PROGRESS_CHANNEL);
    const queuedEvents: EventProgressEvent[] = [];
    let resolveNext: ((event: EventProgressEvent | null) => void) | undefined;
    let aborted = signal.aborted;

    const abort = () => {
      aborted = true;
      resolveNext?.(null);
      resolveNext = undefined;
    };

    signal.addEventListener("abort", abort, { once: true });

    try {
      await pubsub.subscribe((event) => {
        if (event.eventId !== eventId) return;

        if (resolveNext) {
          const resolve = resolveNext;
          resolveNext = undefined;
          resolve(event);
        } else {
          queuedEvents.push(event);
        }
      });

      if (aborted) return;

      const event = await getEvent(eventId);
      let contributions =
        event?.contributions.slice(0, 10).map((entry) => ({
          ...entry,
          contribution: BigInt(entry.contribution),
        })) ?? [];
      const users = new Map(contributions.map((entry) => [entry.user.id, entry.user]));

      yield { type: "ready" };

      while (!aborted) {
        const event =
          queuedEvents.shift() ??
          (await new Promise<EventProgressEvent | null>((resolve) => {
            resolveNext = resolve;
          }));

        if (!event) break;

        const contribution = BigInt(event.userProgress);
        const isListed = contributions.some((entry) => entry.user.id === event.userId);
        const lastContribution = contributions.at(-1)?.contribution;
        const canEnterLeaderboard =
          isListed || contributions.length < 10 || contribution >= (lastContribution ?? 0n);

        if (!canEnterLeaderboard) {
          yield { type: "update", totalProgress: event.totalProgress };
          continue;
        }

        const user =
          users.get(event.userId) ??
          (await prisma.user.findUnique({
            where: { id: event.userId },
            select: { id: true, avatar: true, lastKnownUsername: true },
          }));

        if (!user) {
          yield { type: "update", totalProgress: event.totalProgress };
          continue;
        }

        users.set(user.id, user);
        contributions = [
          { contribution, user },
          ...contributions.filter((entry) => entry.user.id !== event.userId),
        ]
          .toSorted(
            (a, b) =>
              Number(b.contribution - a.contribution) ||
              a.user.lastKnownUsername.localeCompare(b.user.lastKnownUsername),
          )
          .slice(0, 10);

        yield {
          type: "update",
          totalProgress: event.totalProgress,
          userId: event.userId,
          userProgress: event.userProgress,
          user: isListed
            ? undefined
            : { avatar: user.avatar, lastKnownUsername: user.lastKnownUsername },
        };
      }
    } finally {
      signal.removeEventListener("abort", abort);
      pubsub.close();
    }
  },
);
