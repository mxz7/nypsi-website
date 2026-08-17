import { getRequestEvent, query } from "$app/server";
import prisma from "$lib/server/database";
import { RedisPubSub } from "$lib/server/pubsub";
import redis from "$lib/server/redis";
import z from "zod";

const EVENT_PROGRESS_CHANNEL = "nypsi:event-progress";

type EventProgressEvent = {
  eventId: number;
  userId: string;
  userProgress: number;
  totalProgress: number;
};

export type EventProgressUpdate = EventProgressEvent & {
  user: {
    id: string;
    avatar: string;
    lastKnownUsername: string;
  };
};

export const getEventUpdates = query.live(
  z.number().int().positive(),
  async function* (eventId): AsyncGenerator<EventProgressUpdate> {
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

        if (user) yield { ...event, user };
      }
    } finally {
      signal.removeEventListener("abort", abort);
      pubsub.close();
    }
  },
);
