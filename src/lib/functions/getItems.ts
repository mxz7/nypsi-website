import { items } from "$lib/stores";
import type { Item } from "$lib/types/Item";
import { inPlaceSort } from "fast-sort";
import { get } from "svelte/store";
import parseEmoji from "./parseEmoji";

export default async function getItems() {
  if (get(items)) return get(items) as Item[];

  let itemsData: Item[] = Object.values(
    JSON.parse(
      await fetch("https://raw.githubusercontent.com/mxz7/nypsi/main/data/items.json").then((r) =>
        r.text(),
      ),
    ),
  );

  itemsData = itemsData.filter((i) => !["beginner_booster", "cycle"].includes(i.id));

  for (const item of itemsData) {
    const thumbnail = parseEmoji(item.emoji);

    if (thumbnail) item.emoji = thumbnail;
  }

  inPlaceSort(itemsData).asc((i) => i.name);

  items.set(itemsData);

  return itemsData;
}
