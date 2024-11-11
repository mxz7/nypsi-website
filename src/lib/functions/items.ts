import { browser } from "$app/environment";
import { items } from "$lib/state.svelte";
import type { Item } from "$lib/types/Item";
import { inPlaceSort } from "fast-sort";
import parseEmoji from "./parseEmoji";

export default async function getItems() {
  if (!browser) {
    let itemsData: Item[] = Object.values(
      JSON.parse(
        await fetch("https://raw.githubusercontent.com/mxz7/nypsi/main/data/items.json").then((r) =>
          r.text(),
        ),
      ),
    );

    for (const item of itemsData) {
      const thumbnail = parseEmoji(item.emoji);

      if (thumbnail) item.emoji = thumbnail;
    }

    inPlaceSort(itemsData).asc((i) => i.name);

    return itemsData;
  }

  if (items.value) return items.value;

  let itemsData: Item[] = Object.values(
    JSON.parse(
      await fetch("https://raw.githubusercontent.com/mxz7/nypsi/main/data/items.json").then((r) =>
        r.text(),
      ),
    ),
  );

  for (const item of itemsData) {
    const thumbnail = parseEmoji(item.emoji);

    if (thumbnail) item.emoji = thumbnail;
  }

  inPlaceSort(itemsData).asc((i) => i.name);

  items.value = itemsData;

  return itemsData;
}
