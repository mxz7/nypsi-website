import prisma from "$lib/server/database";
import rateLimiter from "$lib/server/ratelimit.js";
import { json } from "@sveltejs/kit";
import { kv } from "@vercel/kv";

export async function GET({ getClientAddress }) {
  const rateLimitAttempt = await rateLimiter.limit(getClientAddress());

  if (!rateLimitAttempt.success) {
    const timeRemaining = Math.floor((rateLimitAttempt.reset - new Date().getTime()) / 1000);
    return new Response(JSON.stringify({ error: `Too many requests. Please try again in ${timeRemaining} seconds.` }), {
      status: 429
    });
  }

  if (await kv.exists("top-balances")) {
    return json(await kv.get("top-balances"));
  }

  const query = await prisma.economy
    .findMany({
      where: {
        AND: [{ money: { gt: 0 } }, { user: { blacklisted: false } }]
      },
      select: {
        money: true,
        banned: true,
        user: {
          select: {
            lastKnownTag: true
          }
        }
      },
      orderBy: {
        money: "desc"
      },
      take: 100
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
          value: `$${x.money.toLocaleString()}`,
          username: user.length > 12 ? `${user.slice(0, 10).trim()}..` : user,
          position: count
        };
      });
    });

  await kv.set("top-balances", JSON.stringify(query), { ex: 300 });

  return json(query);
}
