import { query } from "$app/server";
import { RedisKey } from "$lib/data/constants";
import redis from "$lib/server/redis";
import type { Achievement } from "$lib/types/achievements";
import { error } from "@sveltejs/kit";

export const getAchievementsRemote = query(async () => {
  const cache = await redis.get(RedisKey.data.ACHIEVEMENTS);
  if (cache) {
    return JSON.parse(cache) as { [key: string]: Achievement };
  }

  const res = await fetch(
    "https://raw.githubusercontent.com/mxz7/nypsi/main/data/achievements.json",
  );
  if (res.status !== 200) {
    error(res.status, { message: res.statusText });
  }

  const achievementData: { [key: string]: Achievement } = await res.json();
  await redis.set(RedisKey.data.ACHIEVEMENTS, JSON.stringify(achievementData), "EX", 3600);
  return achievementData;
});
