import { BOT_SERVER_URL } from "$env/static/private";
import prisma from "$lib/server/database.js";
import type { BotStatus } from "$lib/types/Status.js";

export const config = {
  isr: {
    expiration: 30,
  },
};

export async function load({ depends }) {
  depends("status");

  return {
    status: await fetch(`${BOT_SERVER_URL}/status`)
      .then((r) => r.json())
      .catch(() => {
        return {
          main: false,
          clusters: [],
          maintenance: false,
        } as BotStatus;
      }),
    database: (async () => {
      const before = performance.now();
      const query = await prisma.user.findFirst({ select: { id: true } }).catch(() => null);
      const after = performance.now();

      const timeTaken = after - before;

      return { latency: timeTaken, online: Boolean(query) };
    })(),
  };
}
