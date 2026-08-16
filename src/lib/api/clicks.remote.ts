import { getRequestEvent, query } from "$app/server";
import {
  CLICK_EVENTS_CHANNEL,
  getClickRow,
  getClickSnapshot,
  type ClickEvent,
  type ClickRow,
  type ClickSnapshot,
} from "$lib/server/clicks";
import { RedisPubSub } from "$lib/server/pubsub";
import redis from "$lib/server/redis";
import { getBaseData, getPrivacy } from "./users.remote";

export type { ClickRow };

export type ClickStreamUpdate =
  | { type: "snapshot"; snapshot: ClickSnapshot }
  | { type: "click"; row: ClickRow };

export const getClickUpdates = query.live(async function* (): AsyncGenerator<ClickStreamUpdate> {
  const signal = getRequestEvent().request.signal;
  const pubsub = new RedisPubSub<ClickEvent>(redis, CLICK_EVENTS_CHANNEL);
  const queuedEvents: ClickEvent[] = [];
  let resolveNext: ((event: ClickEvent | null) => void) | undefined;
  let aborted = signal.aborted;

  const abort = () => {
    aborted = true;
    resolveNext?.(null);
    resolveNext = undefined;
  };

  signal.addEventListener("abort", abort, { once: true });

  try {
    await pubsub.subscribe((event) => {
      if (resolveNext) {
        const resolve = resolveNext;
        resolveNext = undefined;
        resolve(event);
      } else {
        queuedEvents.push(event);
      }
    });

    if (aborted) return;

    yield { type: "snapshot", snapshot: await getClickSnapshot() };

    while (!aborted) {
      const event =
        queuedEvents.shift() ??
        (await new Promise<ClickEvent | null>((resolve) => {
          resolveNext = resolve;
        }));

      if (!event) break;

      const user = (await getPrivacy(event.userId)) ? undefined : await getBaseData(event.userId);
      const row = getClickRow(event, user);
      if (row) yield { type: "click", row };
    }
  } finally {
    signal.removeEventListener("abort", abort);
    pubsub.close();
  }
});
