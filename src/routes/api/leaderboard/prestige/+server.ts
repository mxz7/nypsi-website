import prisma from "$lib/server/database";
import { json } from "@sveltejs/kit";

export async function GET({ setHeaders }) {
  setHeaders({
    "cache-control": "public, max-age=300",
  });

  const query = await prisma.economy
    .findMany({
      where: {
        AND: [
          { OR: [{ prestige: { gt: 0 } }, { level: { gt: 0 } }] },
          { user: { blacklisted: false } },
        ],
      },
      select: {
        userId: true,
        prestige: true,
        banned: true,
        level: true,
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
      orderBy: [{ prestige: "desc" }, { level: "desc" }],
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
          value: `P${x.prestige} L${x.level}`,
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
