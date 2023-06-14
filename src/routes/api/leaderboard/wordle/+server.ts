import prisma from "$lib/server/database";
import redis from "$lib/server/redis.js";
import { json } from "@sveltejs/kit";
import { inPlaceSort } from "fast-sort";

export async function GET({ setHeaders }) {
  setHeaders({
    "cache-control": "max-age=300",
  });

  // if (await redis.exists("top-wordles")) {
  //   return json(await redis.get("top-wordles"));
  // }

  const query = await prisma.wordleStats
    .findMany({
      where: {
        user: { blacklisted: false },
      },
      select: {
        userId: true,
        win1: true,
        win2: true,
        win3: true,
        win4: true,
        win5: true,
        win6: true,
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
    })
    .then((r) => {
      let count = 0;
      const a = r
        .map((x) => {
          const user = x.user.lastKnownTag.split("#")[0];
          return {
            value: x.win1 + x.win2 + x.win3 + x.win4 + x.win5 + x.win6,
            user: {
              username: x.user.Preferences?.leaderboards ? user : "[hidden]",
              id: x.user.Preferences?.leaderboards ? x.userId : undefined,
            },
          };
        })
        .filter((x) => x.value > 0);

      inPlaceSort(a).desc((x) => x.value);

      return a.map((x) => {
        count++;
        return {
          value: x.value.toLocaleString(),
          user: { username: x.user.username, id: x.user.id },
          position: count,
        };
      });
    });

  await redis.set("top-wordles", JSON.stringify(query), { ex: 300 });

  return json(query);
}
