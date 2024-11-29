import { env } from "$env/dynamic/private";
import prisma from "$lib/server/database.js";
import redis from "$lib/server/redis";
import type { BotStatus } from "$lib/types/Status";

export async function load({ depends }) {
  depends("status");

  return {
    status: await getStatus(),
    database: await (async () => {
      const before = performance.now();
      const query = await prisma.$queryRaw`select 1`.catch(() => null);
      const after = performance.now();

      const timeTaken = after - before;

      return { latency: timeTaken, online: Boolean(query) };
    })(),
  };
}

async function getStatus(): Promise<BotStatus> {
  const cache = await redis.get("cache:status");

  if (cache) {
    return { ...JSON.parse(cache), age: 30 - ((await redis.ttl("cache:status")) || 0) };
  }

  const status = (await fetch(`${env.BOT_SERVER_URL}/status`).then((r) => r.json())) as BotStatus;

  status.time = Date.now();

  await redis.set("cache:status", JSON.stringify(status), "EX", 30);

  return { ...status, age: 0 };
}
