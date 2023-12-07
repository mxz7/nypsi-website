import prisma from "$lib/server/database";
import { json } from "@sveltejs/kit";

export async function GET({ setHeaders }) {
  setHeaders({
    "cache-control": "max-age=0, s-maxage=300",
  });

  const query = await prisma.economy
    .findMany({
      where: {
        AND: [
          { OR: [{ monthVote: { gt: 0 } }, { seasonVote: { gt: 0 } }] },
          { user: { blacklisted: false } },
        ],
      },
      select: {
        userId: true,
        monthVote: true,
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
        monthVote: "desc",
        lastVote: "asc",
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
          value: `${x.monthVote}`,
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
