import { query } from "$app/server";
import parseEmoji from "$lib/functions/parseEmoji";
import redis from "$lib/server/redis.js";
import type { Item } from "$lib/types/Item";
import { error } from "@sveltejs/kit";
import { inPlaceSort } from "fast-sort";

export const getItemsRemote = query(async () => {
  const cache = await redis.get("cache:items");

  if (cache) {
    return JSON.parse(cache) as Item[];
  }

  const res = await fetch("https://raw.githubusercontent.com/mxz7/nypsi/main/data/items.json");

  if (res.status !== 200) {
    error(res.status, { message: res.statusText });
  }

  const itemsData: Item[] = Object.values(await res.json());

  for (const item of itemsData) {
    const thumbnail = parseEmoji(item.emoji);

    if (thumbnail) item.emoji = thumbnail;
  }

  inPlaceSort(itemsData).asc((i) => i.name);

  await redis.set("cache:items", JSON.stringify(itemsData), "EX", 3600);

  return itemsData;
});
