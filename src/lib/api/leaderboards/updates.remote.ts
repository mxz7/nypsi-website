import { getRequestEvent, query } from "$app/server";
import { getAuthedUser } from "$lib/api/auth.remote";
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

type LeaderboardStreamEvent = LeaderboardUpdateEvent & {
  /** Running increment total for this entity's increment sequence. */
  incrementTotal?: string;
  /** Identifies the sequence that owns incrementTotal. */
  streamId?: string;
};

type IncrementState = {
  streamId: string;
  total: bigint;
};

export type LeaderboardStreamMessage =
  | { type: "ready" }
  | { type: "update"; event: LeaderboardStreamEvent };

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
    // query.live is latest-wins, so keep a running delta per entity for the
    // client to recover increments from intermediate values it does not see.
    const incrementStates = new Map<string, IncrementState>();
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

      const [snapshot, authedUser] = await Promise.all([
        knownType.success
          ? getLeaderboard(knownType.data as LeaderboardType)
          : getItemLeaderboard(type),
        type === "guilds" ? null : getAuthedUser(),
      ]);
      const entityIds = new Set(snapshot.flatMap((row) => (row.user?.id ? [row.user.id] : [])));
      if (authedUser) entityIds.add(authedUser.id);

      yield { type: "ready" };

      while (!aborted) {
        const event =
          queuedEvents.shift() ??
          (await new Promise<LeaderboardUpdateEvent | null>((resolve) => {
            resolveNext = resolve;
          }));

        if (!event) break;

        if (!entityIds.has(event.entityId)) continue;

        let streamEvent: LeaderboardStreamEvent = event;

        if (event.increment) {
          let increment: bigint;

          try {
            increment = BigInt(event.value);
          } catch {
            continue;
          }

          const state: IncrementState = incrementStates.get(event.entityId) ?? {
            streamId: crypto.randomUUID(),
            total: 0n,
          };
          state.total += increment;
          incrementStates.set(event.entityId, state);
          streamEvent = {
            ...event,
            incrementTotal: state.total.toString(),
            streamId: state.streamId,
          };
        } else {
          incrementStates.delete(event.entityId);
        }

        yield { type: "update", event: streamEvent };
      }
    } finally {
      signal.removeEventListener("abort", abort);
      pubsub.close();
    }
  },
);
