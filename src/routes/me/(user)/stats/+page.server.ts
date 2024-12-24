import prisma from "$lib/server/database.js";
import redis from "$lib/server/redis.js";
import { inPlaceSort } from "fast-sort";

export async function load({ parent, setHeaders }) {
  const { user } = await parent();

  if (!user) return;

  try {
    setHeaders({
      "cache-control": "private, max-age=300, must-revalidate",
    });
  } catch {}

  setHeaders({ "x-accel-buffering": "no" });

  return {
    commandStats: prisma.commandUse.findMany({
      where: { userId: user.id },
      select: { command: true, uses: true },
      orderBy: { uses: "desc" },
    }),
    itemStats: prisma.stats.findMany({
      where: { userId: user.id },
      select: { itemId: true, amount: true },
      orderBy: { amount: "desc" },
    }),
    scratchStats: getScratchStats(user.id),
    gambleStats: getGambleStats(user.id),
  };
}

async function getScratchStats(userId: string) {
  const cache = await redis.get(`cache:scratchstats:${userId}`);

  if (cache) {
    return JSON.parse(cache);
  }

  const query = await prisma.game
    .groupBy({
      where: {
        AND: [{ userId }, { game: { contains: "scratch" } }],
      },
      by: ["game"],
      _count: {
        _all: true,
      },
      _sum: {
        win: true,
      },
    })
    .then((r) => inPlaceSort(r).desc((r) => r._count._all));

  await redis.set(`cache:scratchstats:${userId}`, JSON.stringify(query), "EX", 600);

  return query;
}

async function getGambleStats(userId: string) {
  const cache = await redis.get(`cache:gamblestats:${userId}`);

  if (cache) {
    return JSON.parse(cache);
  }

  const data = await prisma.game
    .groupBy({
      where: {
        AND: [{ userId: userId }, { game: { not: { contains: "scratch" } } }],
      },
      by: ["game"],
      _count: {
        _all: true,
      },
      _avg: {
        bet: true,
      },
      _sum: {
        bet: true,
        earned: true,
        xpEarned: true,
      },
    })
    .then(async (res) => {
      inPlaceSort(res).desc((i) => i._count._all);

      const wins = new Map<string, number>();

      const promises: Promise<void>[] = [];

      for (const game of res) {
        const func = async () => {
          wins.set(
            game.game,
            await prisma.game.count({
              where: {
                AND: [{ userId }, { game: game.game }, { win: 1 }],
              },
            }),
          );
        };

        promises.push(func());
      }

      await Promise.all(promises);

      return res.map((game) => {
        return {
          ...game,
          _sum: {
            bet: Number(game._sum.bet),
            earned: Number(game._sum.earned),
            xpEarned: Number(game._sum.xpEarned),
          },
          wins: wins.get(game.game),
        };
      });
    });

  await redis.set(`cache:gamblestats:${userId}`, JSON.stringify(data), "EX", 600);

  return data;
}
