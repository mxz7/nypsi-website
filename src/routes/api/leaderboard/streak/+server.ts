import prisma from "$lib/server/database";
import { json } from "@sveltejs/kit";

export async function GET({ setHeaders }) {
  setHeaders({
    "cache-control": "public, max-age=300, must-revalidate",
  });

  const query = await prisma.economy
    .findMany({
      where: {
        AND: [{ dailyStreak: { gt: 0 } }, { user: { blacklisted: false } }],
      },
      select: {
        userId: true,
        dailyStreak: true,
        banned: true,
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
      },
      orderBy: {
        dailyStreak: "desc",
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
        const user = x.user.lastKnownUsername.split("#")[0];
        return {
          value: `${x.dailyStreak.toLocaleString()}`,
          user: {
            username: x.user.Preferences?.leaderboards ? user : "[hidden]",
            id: x.user.Preferences?.leaderboards ? x.userId : undefined,
            tag: x.user.Tags.length > 0 ? x.user.Tags[0].tagId : null,
          },
          position: count,
        };
      });
    });

  return json(query);
}
