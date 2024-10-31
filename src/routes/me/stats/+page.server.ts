import prisma from "$lib/server/database.js";
import { inPlaceSort } from "fast-sort";

export async function load({ parent, setHeaders }) {
  const { user } = await parent();

  if (!user) return;

  try {
    setHeaders({
      "cache-control": "private, max-age=0",
    });
  } catch {}

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

    scratchStats: prisma.game
      .groupBy({
        where: {
          AND: [{ userId: user.id }, { game: { contains: "scratch" } }],
        },
        by: ["game"],
        _count: {
          _all: true,
        },
        _sum: {
          win: true,
        },
      })
      .then((r) => inPlaceSort(r).desc((r) => r._count._all)),
    gambleStats: prisma.game
      .groupBy({
        where: {
          AND: [{ userId: user.id }, { game: { not: { contains: "scratch" } } }],
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
                  AND: [{ userId: user ? user.id : "0" }, { game: game.game }, { win: 1 }],
                },
              }),
            );
          };

          promises.push(func());
        }

        await Promise.all(promises);

        return res.map((game) => {
          return { ...game, wins: wins.get(game.game) };
        });
      }),
  };
}
