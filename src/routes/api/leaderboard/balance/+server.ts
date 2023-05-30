import prisma from "$lib/server/database";
import rateLimiter from "$lib/server/ratelimit.js";
import { json } from "@sveltejs/kit";

export async function GET({ getClientAddress }) {
  const rateLimitAttempt = await rateLimiter.limit(getClientAddress());

  if (!rateLimitAttempt.success) {
    const timeRemaining = Math.floor((rateLimitAttempt.reset - new Date().getTime()) / 1000);
    return new Response(JSON.stringify({ error: `Too many requests. Please try again in ${timeRemaining} seconds.` }), {
      status: 429
    });
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
      take: 250
    })
    .then((r) => {
      r.forEach((user) => {
        if (user.banned && user.banned.getTime() > Date.now()) r.splice(r.indexOf(user), 1);
      });
      return r.map((x) => {
        return { money: `$${x.money.toLocaleString()}`, username: x.user.lastKnownTag.split("#")[0] };
      });
    });

  return json(query);
}
