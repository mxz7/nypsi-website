import prisma from "$lib/server/database";
import { json } from "@sveltejs/kit";

export async function GET({ setHeaders }) {
  setHeaders({
    "cache-control": "public, max-age=300, must-revalidate",
  });

  const query =
    await prisma.$queryRaw`select "User"."id" as "userId", count(*) as value, "User"."lastKnownTag", "Tags"."tagId", "Preferences"."leaderboards" as "privacy" from "User" 
    right join "WordleGame" on "WordleGame"."userId" = "User"."id" 
    left join "Tags" on "Tags"."userId" = "User"."id" and "Tags"."selected" = true
    left join "Preferences" on "Preferences"."userId" = "User"."id"
    where "WordleGame"."won" = true and "User"."blacklisted" = false 
    group by "WordleGame"."userId", "User"."id", "Tags"."tagId", "Preferences"."leaderboards"
    order by "value" desc limit 100`.then(
      (
        i: {
          value: bigint;
          userId: string;
          lastKnownTag: string;
          banned: Date;
          tagId: string;
          privacy: boolean;
        }[],
      ) => {
        return i.map((i, index) => ({
          value: i.value.toLocaleString(),
          position: index + 1,
          user: {
            username: i.privacy ? i.lastKnownTag : "[hidden]",
            id: i.privacy ? i.userId : undefined,
            tag: i.privacy ? i.tagId : undefined,
          },
        }));
      },
    );

  return json(query);
}
