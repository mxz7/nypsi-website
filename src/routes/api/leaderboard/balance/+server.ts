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
      select: {
        money: true,
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
    .then((r) =>
      r.map((x) => {
        return { money: `$${x.money.toLocaleString()}`, user: x.user };
      })
    );

  return json(query);
}
