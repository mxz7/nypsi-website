import prisma from "$lib/server/database";
import redis from "$lib/server/redis.js";
import { json } from "@sveltejs/kit";

export async function GET({ setHeaders }) {
  setHeaders({
    "cache-control": "max-age=300",
  });

  if (await redis.exists("top-networth")) {
    return json(await redis.get("top-networth"));
  }

  const query = await prisma.economy
    .findMany({
      where: {
        AND: [{ netWorth: { gt: 0 } }, { user: { blacklisted: false } }],
      },
      select: {
        netWorth: true,
        banned: true,
        user: {
          select: {
            Preferences: {
              select: {
                leaderboards: true,
              },
            },
            lastKnownTag: true,
          },
        },
      },
      orderBy: {
        netWorth: "desc",
      },
      take: 100,
    })
    .then((r) => {
      let count = 0;
      r.forEach((user) => {
        if (user.banned && user.banned.getTime() > Date.now()) r.splice(r.indexOf(user), 1);
      });
      return r.map((x) => {
        count++;
        const user = x.user.lastKnownTag.split("#")[0];
        return {
          value: `$${x.netWorth.toLocaleString()}`,
          username: x.user.Preferences?.leaderboards ? user : "[hidden]",
          position: count,
        };
      });
    });

  await redis.set("top-networth", JSON.stringify(query), { ex: 300 });

  return json(query);
}
