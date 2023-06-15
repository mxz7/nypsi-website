import prisma from "$lib/server/database";
import { json } from "@sveltejs/kit";

export async function GET({ setHeaders, params }) {
  const query = await prisma.game
    .findUnique({
      where: {
        id: parseInt(params.id, 36),
      },
      select: {
        bet: true,
        date: true,
        earned: true,
        xpEarned: true,
        game: true,
        id: true,
        outcome: true,
        win: true,
        economy: {
          select: {
            user: {
              select: {
                Preferences: {
                  select: {
                    leaderboards: true,
                  },
                },
                lastKnownUsername: true,
              },
            },
          },
        },
      },
    })
    .then((r) => {
      return {
        ok: Boolean(r),
        bet: Number(r?.bet),
        date: r?.date.getTime(),
        earned: Number(r?.earned),
        game: r?.game,
        id: r?.id,
        outcome: r?.outcome,
        win: r?.win,
        xpEarned: r?.xpEarned,
        username: r?.economy?.user.Preferences?.leaderboards
          ? r?.economy?.user.lastKnownUsername.split("#")[0] || "[redacted]"
          : "[hidden]",
      };
    });

  if (query.ok) {
    setHeaders({
      "cache-control": "max-age=86400",
    });
  } else {
    setHeaders({
      "cache-control": "max-age=60",
    });
  }

  return json(query);
}
