import prisma from "$lib/server/database";
import { json } from "@sveltejs/kit";

export async function GET({ setHeaders }) {
  setHeaders({
    "cache-control": "public, max-age=300, must-revalidate",
  });

  function formatTime(ms: number) {
    const minutes = Math.floor(ms / 60000);
    let seconds = ((ms % 60000) / 1000).toFixed(2);

    if (minutes > 0) {
      seconds = Math.round((ms % 60000) / 1000).toString();
    }

    return `${minutes > 0 ? `${minutes}m` : ""}${seconds}s`;
  }

  const query =
    await prisma.$queryRaw`select "User"."id" as "userId", min("WordleGame"."time") as value, "User"."lastKnownTag", "Tags"."tagId", "Preferences"."leaderboards" as "privacy" from "User" 
    right join "WordleGame" on "WordleGame"."userId" = "User"."id" 
    left join "Tags" on "Tags"."userId" = "User"."id" and "Tags"."selected" = true
    left join "Preferences" on "Preferences"."userId" = "User"."id"
    where "WordleGame"."won" = true and "User"."blacklisted" = false and "WordleGame"."time" > 0
    group by "WordleGame"."userId", "User"."id", "Tags"."tagId", "Preferences"."leaderboards"
    order by "value" asc limit 100`.then(
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
          value: formatTime(Number(i.value)),
          position: index + 1,
          user: {
            username: i.privacy ? i.lastKnownTag : "[hidden]",
            id: i.privacy ? i.userId : undefined,
            tag: i.tagId,
          },
        }));
      },
    );

  return json(query);
}
