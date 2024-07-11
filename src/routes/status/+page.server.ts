import { BOT_SERVER_URL } from "$env/static/private";
import prisma from "$lib/server/database.js";
import type { BotStatus } from "$lib/types/Status.js";

export async function load({ depends, setHeaders }) {
  depends("status");
  setHeaders({ "cache-control": "s-maxage=15" });

  return {
    status: await fetch(`${BOT_SERVER_URL}/status`)
      .then(async (r) => ({ ...(await r.json()), time: Date.now() }) as Promise<BotStatus>)
      .catch(() => {
        return {
          main: false,
          clusters: [],
          maintenance: false,
        } as BotStatus;
      }),
    database: await (async () => {
      const before = performance.now();
      const query = await prisma.$queryRaw`select 1`.catch(() => null);
      const after = performance.now();

      const timeTaken = after - before;

      return { latency: timeTaken, online: Boolean(query) };
    })(),
  };
}
