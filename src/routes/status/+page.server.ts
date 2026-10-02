import { BOT_SERVER_URL, BOT_API_AUTH } from "$app/env/private";
import prisma from "#lib/server/database.js";
import redis from "#lib/server/redis.js";
import type { BotStatus } from "#lib/types/Status.js";

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
    return {
      ...JSON.parse(cache),
      age: 30 - ((await redis.ttl("cache:status")) || 0),
    };
  }

  const status = (await fetch(`${BOT_SERVER_URL}/status`, {
    headers: { Authorization: `Bearer ${BOT_API_AUTH}` },
  }).then((r) => r.json())) as BotStatus;

  status.time = Date.now();

  await redis.set("cache:status", JSON.stringify(status), "EX", 30);

  return { ...status, age: 0 };
}
