import { RedisCache } from "$lib/server/cache";
import type { Event } from "$lib/types/Item";

const eventDataCache = new RedisCache<Record<string, Event>>("cache:events:data", 3600);

export async function getEventData(
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
): Promise<{ [key: string]: Event }> {
  const cached = await eventDataCache.get("all");

  if (cached !== null) return cached;

  const eventData = await fetch(
    "https://raw.githubusercontent.com/mxz7/nypsi/refs/heads/main/data/events.json",
  ).then((response) => response.json() as Promise<Record<string, Event>>);

  await eventDataCache.set("all", eventData);

  return eventData;
}
