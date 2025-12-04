import prisma from "$lib/server/database";
import { json } from "@sveltejs/kit";

export async function GET({ setHeaders }) {
  setHeaders({
    "cache-control": "public, max-age=300, must-revalidate",
  });

  // very proud of myself for this

  // prisma group by was very limiting and intellisense wasnt working so i built it myself 😀

  const query =
    await prisma.$queryRaw`select sum("CommandUse"."uses") as value, "CommandUse"."userId", "User"."lastKnownUsername", "Economy"."banned", "Tags"."tagId", "Preferences"."leaderboards" from "User"
    right join "CommandUse" on "CommandUse"."userId" = "User"."id" 
    left join "Economy" on "Economy"."userId" = "User"."id"
    left join "Tags" on "Tags"."userId" = "User"."id" and "Tags"."selected" = true
    left join "Preferences" on "Preferences"."userId" = "User"."id"
    where "User"."blacklisted" = false
    group by "CommandUse"."userId", "User"."id", "Economy"."userId", "Tags"."tagId", "Preferences"."leaderboards"
    order by "value" desc limit 100`.then(
      (
        i: {
          value: bigint;
          userId: string;
          lastKnownUsername: string;
          banned: Date;
          tagId: string;
          leaderboards: boolean;
        }[],
      ) => {
        return i
          .filter((i) => (i.banned ? Date.now() > i.banned.getTime() : true))
          .map((i, index) => ({
            value: i.value.toLocaleString(),
            position: index + 1,
            user: {
              username: i.leaderboards ? i.lastKnownUsername : "[hidden]",
              id: i.leaderboards ? i.userId : undefined,
              tag: i.leaderboards ? i.tagId : undefined,
            },
          }));
      },
    );

  return json(query);
}
