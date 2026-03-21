import { query } from "$app/server";
import parseEmoji from "$lib/functions/parseEmoji";
import redis from "$lib/server/redis";
import { error } from "@sveltejs/kit";

export type Tag = { tagId: string; emoji: string; name: string };

export const getTagsRemote = query(async () => {
  const cache = await redis.get("cache:tags");
  if (cache) {
    return JSON.parse(cache) as { [key: string]: Tag };
  }

  const res = await fetch("https://raw.githubusercontent.com/mxz7/nypsi/main/data/tags.json");
  if (res.status !== 200) {
    error(res.status, { message: res.statusText });
  }

  const tagData: { [key: string]: Tag } = await res.json();

  for (const [tagId, tag] of Object.entries(tagData)) {
    tagData[tagId].emoji = parseEmoji(tag.emoji);
  }

  await redis.set("cache:tags", JSON.stringify(tagData), "EX", 3600);
  return tagData;
});
