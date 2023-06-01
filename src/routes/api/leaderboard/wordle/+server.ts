import prisma from "$lib/server/database";
import rateLimiter from "$lib/server/ratelimit.js";
import redis from "$lib/server/redis.js";
import { json } from "@sveltejs/kit";
import { inPlaceSort } from "fast-sort";

export async function GET({ getClientAddress, setHeaders }) {
  const rateLimitAttempt = await rateLimiter.limit(getClientAddress());

  if (!rateLimitAttempt.success) {
    const timeRemaining = Math.floor((rateLimitAttempt.reset - new Date().getTime()) / 1000);
    return new Response(JSON.stringify({ error: `Too many requests. Please try again in ${timeRemaining} seconds.` }), {
      status: 429
    });
  }

  setHeaders({
    "cache-control": "max-age=120"
  });

  // if (await redis.exists("top-wordles")) {
  //   return json(await redis.get("top-wordles"));
  // }

  const query = await prisma.wordleStats
    .findMany({
      where: {
        user: { blacklisted: false }
      },
      select: {
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
                leaderboards: true
              }
            },
            lastKnownTag: true
          }
        }
      }
    })
    .then((r) => {
      let count = 0;
      const a = r
        .map((x) => {
          const user = x.user.lastKnownTag.split("#")[0];
          return {
            value: x.win1 + x.win2 + x.win3 + x.win4 + x.win5 + x.win6,
            username: x.user.Preferences?.leaderboards ? user : "[hidden]"
          };
        })
        .filter((x) => x.value > 0);

      inPlaceSort(a).desc((x) => x.value);

      return a.map((x) => {
        count++;
        return {
          value: x.value.toLocaleString(),
          username: x.username,
          position: count
        };
      });
    });

  await redis.set("top-wordles", JSON.stringify(query), { ex: 300 });

  return json(query);
}
