import prisma from "$lib/server/database.js";
import { json } from "@sveltejs/kit";

export async function GET({ params, setHeaders }) {
  setHeaders({
    "cache-control": "max-age=0, s-maxage=300",
  });

  if (params.itemId === "lottery_ticket") return json([]);

  const query = await prisma.inventory
    .findMany({
      where: {
        AND: [
          { item: params.itemId },
          { amount: { gt: 0 } },
          { economy: { user: { blacklisted: false } } },
        ],
      },
      select: {
        userId: true,
        amount: true,
        economy: {
          select: {
            user: {
              select: {
                Tags: {
                  where: {
                    selected: true,
                  },
                  select: {
                    tagId: true,
                  },
                },
                Preferences: {
                  select: {
                    leaderboards: true,
                  },
                },
                lastKnownUsername: true,
              },
            },
            banned: true,
          },
        },
      },
      orderBy: {
        amount: "desc",
      },
      take: 100,
    })
    .then((r) => {
      let count = 0;
      r.forEach((user) => {
        if (user.economy.banned && user.economy.banned.getTime() > Date.now())
          r.splice(r.indexOf(user), 1);
      });
      return r.map((x) => {
        count++;
        const user = x.economy.user.lastKnownUsername.split("#")[0];
        return {
          value: `${x.amount.toLocaleString()}`,
          user: {
            username: x.economy.user.Preferences?.leaderboards ? user : "[hidden]",
            id: x.economy.user.Preferences?.leaderboards ? x.userId : undefined,
            tag: x.economy.user.Tags.length > 0 ? x.economy.user.Tags[0].tagId : null,
          },
          position: count,
        };
      });
    });

  return json(query);
}
