import { BOT_SERVER_URL } from "$env/static/private";
import redis from "$lib/server/redis.js";
import type { BotStatus } from "$lib/types/Status.js";

export async function load({ setHeaders, depends }) {
  depends("status");
  setHeaders({ "cache-control": "max-age=30" });

  const cache = await redis.get("nypsi:status").catch(() => undefined);

  return {
    status: cache
      ? (cache as BotStatus)
      : await fetch(`${BOT_SERVER_URL}/status`).then(async (r) => {
          const response = await r.json();

          response.cached = Date.now();

          await redis.set("nypsi:status", JSON.stringify(response), { ex: 30 }).catch(() => null);

          return response as BotStatus;
        }),
  };
}
