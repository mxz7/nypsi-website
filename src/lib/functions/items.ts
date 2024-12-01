import { browser } from "$app/environment";
import { items } from "$lib/state.svelte";
import type { Item } from "$lib/types/Item";

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
