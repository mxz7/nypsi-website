import { browser } from "$app/environment";
import { items, itemsOdds } from "$lib/state.svelte";
import type { Item, LootPool } from "$lib/types/Item";

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
