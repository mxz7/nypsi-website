import prisma from "$lib/server/database.js";
import { json } from "@sveltejs/kit";

export async function GET({ setHeaders }) {
  setHeaders({
    "cache-control": "max-age=0, s-maxage=300",
  });

  const query = await prisma.achievements
    .findMany({
      where: {
        OR: [
          { AND: [{ completed: false }, { achievementId: { startsWith: "lucky_" } }] },
          { AND: [{ completed: true }, { achievementId: { equals: "lucky_v" } }] },
        ],
      },
      select: {
        userId: true,
        progress: true,
        user: {
          select: {
            id: true,
            lastKnownUsername: true,
            blacklisted: true,
            Preferences: {
              select: {
                leaderboards: true,
              },
            },
            Tags: {
              select: {
                tagId: true,
              },
              where: {
                selected: true,
              },
            },
            Economy: {
              select: {
                banned: true,
              },
            },
          },
        },
      },
      orderBy: {
        progress: "desc",
      },
      take: 100,
    })
    .then((r) => {
      const filtered = r.filter((i) => {
        if (!i.user.blacklisted && !i.user?.Economy?.banned) return true;
        if (i.user.blacklisted) return false;
        if (i.user.Economy.banned && i.user.Economy.banned.getTime() > Date.now()) return false;

        return true;
      });

      let count = 0;
      return filtered.map((x) => {
        count++;
        const user = x.user.lastKnownUsername.split("#")[0];
        return {
          value: x.progress.toLocaleString(),
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
