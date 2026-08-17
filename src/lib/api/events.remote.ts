import { getRequestEvent, query } from "$app/server";
import { getEventData } from "$lib/functions/items";
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

export const getEventsData = query(() => getEventData(getRequestEvent().fetch));

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

export type EventProgressUpdate = EventProgressEvent & {
  type: "update";
  user: {
    id: string;
    avatar: string;
    lastKnownUsername: string;
  };
};

type EventProgressMessage = { type: "snapshot"; totalProgress: number } | EventProgressUpdate;

export const getEventUpdates = query.live(
  z.number().int().positive(),
  async function* (eventId): AsyncGenerator<EventProgressMessage> {
    yield { type: "snapshot", totalProgress: await getEventProgress(eventId) };

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

      while (!aborted) {
        const event =
          queuedEvents.shift() ??
          (await new Promise<EventProgressEvent | null>((resolve) => {
            resolveNext = resolve;
          }));

        if (!event) break;

        const user = await prisma.user.findUnique({
          where: { id: event.userId },
          select: { id: true, avatar: true, lastKnownUsername: true },
        });

        if (user) yield { type: "update", ...event, user };
      }
    } finally {
      signal.removeEventListener("abort", abort);
      pubsub.close();
    }
  },
);
