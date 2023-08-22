import prisma from "$lib/server/database";
import { json } from "@sveltejs/kit";
import { inPlaceSort } from "fast-sort";

export async function GET({ setHeaders }) {
  setHeaders({
    "cache-control": "max-age=0, s-maxage=300",
  });

  const query = await prisma.wordleStats
    .findMany({
      where: {
        user: { blacklisted: false },
      },
      select: {
        userId: true,
        win1: true,
        win2: true,
        win3: true,
        win4: true,
        win5: true,
        win6: true,
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
    })
    .then((r) => {
      let count = 0;
      const a = r
        .map((x) => {
          const user = x.user.lastKnownUsername.split("#")[0];
          return {
            value: x.win1 + x.win2 + x.win3 + x.win4 + x.win5 + x.win6,
            user: {
              username: x.user.Preferences?.leaderboards ? user : "[hidden]",
              id: x.user.Preferences?.leaderboards ? x.userId : undefined,
              tag: x.user.Tags.length > 0 ? x.user.Tags[0].tagId : null,
            },
          };
        })
        .filter((x) => x.value > 0);

      inPlaceSort(a).desc((x) => x.value);

      return a.map((x) => {
        count++;
        return {
          value: x.value.toLocaleString(),
          user: { username: x.user.username, id: x.user.id },
          position: count,
        };
      });
    });

  return json(query);
}
