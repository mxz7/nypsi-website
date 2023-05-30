import prisma from "$lib/server/database.js";
import rateLimiter from "$lib/server/ratelimit.js";
import { json } from "@sveltejs/kit";
import { kv } from "@vercel/kv";

export async function GET({ getClientAddress, params }) {
  const rateLimitAttempt = await rateLimiter.limit(getClientAddress());

  if (!rateLimitAttempt.success) {
    const timeRemaining = Math.floor((rateLimitAttempt.reset - new Date().getTime()) / 1000);
    return new Response(JSON.stringify({ error: `Too many requests. Please try again in ${timeRemaining} seconds.` }), {
      status: 429
    });
  }

  if (await kv.exists(`top-item-${params.itemId}`)) {
    return json(await kv.get(`top-item-${params.itemId}`));
  }

  const query = await prisma.inventory
    .findMany({
      where: {
        AND: [{ item: params.itemId }, { amount: { gt: 0 } }, { economy: { user: { blacklisted: false } } }]
      },
      select: {
        amount: true,
        economy: {
          select: {
            user: {
              select: {
                lastKnownTag: true
              }
            },
            banned: true
          }
        }
      },
      orderBy: {
        amount: "desc"
      },
      take: 100
    })
    .then((r) => {
      let count = 0;
      r.forEach((user) => {
        if (user.economy.banned && user.economy.banned.getTime() > Date.now()) r.splice(r.indexOf(user), 1);
      });
      return r.map((x) => {
        count++;
        const user = x.economy.user.lastKnownTag.split("#")[0];
        return {
          value: `${x.amount.toLocaleString()}`,
          username: user.length > 12 ? `${user.slice(0, 10).trim()}..` : user,
          position: count
        };
      });
    });

  await kv.set(`top-item-${params.itemId}`, JSON.stringify(query), { ex: 300 });

  return json(query);
}
