import prisma from "$lib/server/database";
import { json } from "@sveltejs/kit";

export async function GET({ setHeaders }) {
  setHeaders({
    "cache-control": "max-age=0, s-maxage=300",
  });

  // very proud of myself for this

  // prisma group by was very limiting and intellisense wasnt working so i built it myself 😀

  const query =
    await prisma.$queryRaw`select sum("CommandUse"."uses") as value, "CommandUse"."userId", "User"."lastKnownTag", "Economy"."banned", "Tags"."tagId" from "User"
    right join "CommandUse" on "CommandUse"."userId" = "User"."id" 
    left join "Economy" on "Economy"."userId" = "User"."id"
    left join "Tags" on "Tags"."userId" = "User"."id" and "Tags"."selected" = true
    where "User"."blacklisted" = false
    group by "CommandUse"."userId", "User"."id", "Economy"."userId", "Tags"."tagId"
    order by "value" desc limit 100`.then(
      (
        i: {
          value: bigint;
          userId: string;
          lastKnownTag: string;
          banned: Date;
          tagId: string;
        }[],
      ) => {
        return i
          .filter((i) => (i.banned ? Date.now() > i.banned.getTime() : true))
          .map((i, index) => ({
            value: i.value.toLocaleString(),
            position: index + 1,
            user: { username: i.lastKnownTag, id: i.userId, tag: i.tagId },
          }));
      },
    );

  return json(query);
}
