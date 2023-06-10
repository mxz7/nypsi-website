import prisma from "$lib/server/database";
import redis from "$lib/server/redis.js";
import { json } from "@sveltejs/kit";

export async function GET({ setHeaders }) {
  setHeaders({
    "cache-control": "max-age=300",
  });

  if (await redis.exists("top-prestiges")) {
    return json(await redis.get("top-prestiges"));
  }

  const query = await prisma.economy
    .findMany({
      where: {
        AND: [{ prestige: { gt: 0 } }, { user: { blacklisted: false } }],
      },
      select: {
        prestige: true,
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
        prestige: "desc",
      },
      take: 25,
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
          value: `${x.prestige.toLocaleString()}`,
          username: x.user.Preferences?.leaderboards ? user : "[hidden]",
          position: count,
        };
      });
    });

  await redis.set("top-prestiges", JSON.stringify(query), { ex: 300 });

  return json(query);
}
