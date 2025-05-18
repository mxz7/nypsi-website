import type { Tag } from "$lib/functions/tags.js";
import redis from "$lib/server/redis.js";
import { error, json } from "@sveltejs/kit";

export async function GET({ setHeaders }) {
  setHeaders({
    "cache-control": "public, max-age=3600, must-revalidate",
  });

  const cache = await redis.get("cache:tags");

  if (cache) {
    return json(JSON.parse(cache));
  }

  const res = await fetch("https://raw.githubusercontent.com/mxz7/nypsi/main/data/tags.json");

  if (res.status !== 200) return error(res.status, { message: res.statusText });

  const tagData: { [key: string]: Tag } = await res.json();

  await redis.set("cache:tags", JSON.stringify(tagData), "EX", 3600);

  return json(tagData);
}
