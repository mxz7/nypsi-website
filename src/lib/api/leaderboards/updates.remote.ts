import { getRequestEvent, query } from "$app/server";
import { RedisPubSub } from "$lib/server/pubsub";
import redis from "$lib/server/redis";
import { getLeaderboardUpdatesChannel, type LeaderboardUpdateEvent } from "$lib/types/leaderboards";
import z from "zod";
import { getItemLeaderboard, getLeaderboard } from "./leaderboards.remote";
import { LeaderboardTypeSchema, type LeaderboardType } from "./shared";

const leaderboardUpdateEventSchema = z.object({
  entityId: z.string().min(1).max(100),
  value: z.string().min(1).max(100),
  increment: z.literal(true).optional(),
});

export type LeaderboardStreamMessage =
  | { type: "ready" }
  | { type: "update"; event: LeaderboardUpdateEvent };

export const getLeaderboardUpdates = query.live(
  z.string().min(1).max(100),
  async function* (type): AsyncGenerator<LeaderboardStreamMessage> {
    const signal = getRequestEvent().request.signal;
    const knownType = LeaderboardTypeSchema.safeParse(type);
    const pubsub = new RedisPubSub<LeaderboardUpdateEvent>(
      redis,
      getLeaderboardUpdatesChannel(knownType.success ? type : `item-${type}`),
    );
    const queuedEvents: LeaderboardUpdateEvent[] = [];
    let resolveNext: ((event: LeaderboardUpdateEvent | null) => void) | undefined;
    let aborted = signal.aborted;

    const abort = () => {
      aborted = true;
      resolveNext?.(null);
      resolveNext = undefined;
    };

    signal.addEventListener("abort", abort, { once: true });

    try {
      await pubsub.subscribe((rawEvent) => {
        const parsed = leaderboardUpdateEventSchema.safeParse(rawEvent);
        if (!parsed.success) return;

        if (resolveNext) {
          const resolve = resolveNext;
          resolveNext = undefined;
          resolve(parsed.data);
        } else {
          queuedEvents.push(parsed.data);
        }
      });

      if (aborted) return;

      const snapshot = await (knownType.success
        ? getLeaderboard(knownType.data as LeaderboardType)
        : getItemLeaderboard(type));
      const entityIds = new Set(snapshot.flatMap((row) => (row.user?.id ? [row.user.id] : [])));

      yield { type: "ready" };

      while (!aborted) {
        const event =
          queuedEvents.shift() ??
          (await new Promise<LeaderboardUpdateEvent | null>((resolve) => {
            resolveNext = resolve;
          }));

        if (!event) break;

        if (!entityIds.has(event.entityId)) continue;
        yield { type: "update", event };
      }
    } finally {
      signal.removeEventListener("abort", abort);
      pubsub.close();
    }
  },
);
