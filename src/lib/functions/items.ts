import { browser } from "$app/environment";
import { eventsData, items, itemsOdds } from "$lib/state.svelte";
import type { Event, Item, LootPool } from "$lib/types/Item";

export default async function getItems(
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
) {
  if (!browser) {
    const itemsData: Item[] = Object.values(await fetch("/api/items").then((r) => r.json()));

    return itemsData;
  }

  if (items.value) return items.value;

  const itemsData: Item[] = Object.values(await fetch("/api/items").then((r) => r.json()));

  items.value = itemsData;

  return itemsData;
}

export async function getCrateOdds(
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
) {
  if (!browser) {
    const oddsData = await fetch(
      "https://raw.githubusercontent.com/mxz7/nypsi/refs/heads/main/data/loot_pools.json",
    ).then((r) => r.json());

    return oddsData as { [key: string]: LootPool };
  }

  if (itemsOdds.value) return itemsOdds.value;

  const oddsData = await fetch(
    "https://raw.githubusercontent.com/mxz7/nypsi/refs/heads/main/data/loot_pools.json",
  ).then((r) => r.json());
  itemsOdds.value = oddsData;

  return oddsData as { [key: string]: LootPool };
}

export async function getEventData(
  fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
): Promise<{ [key: string]: Event }> {
  if (!browser) {
    const eventsData = await fetch(
      "https://raw.githubusercontent.com/mxz7/nypsi/refs/heads/main/data/events.json",
    ).then((r) => r.json());

    return eventsData as { [key: string]: Event };
  }

  if (eventsData.value) return eventsData.value;

  const eventsDataFetched = await fetch(
    "https://raw.githubusercontent.com/mxz7/nypsi/refs/heads/main/data/events.json",
  ).then((r) => r.json());
  eventsData.value = eventsDataFetched;

  return eventsDataFetched as { [key: string]: Event };
}
