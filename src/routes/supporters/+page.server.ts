import { getTags } from "$lib/functions/tags";
import prisma from "$lib/server/database";

export async function load({ fetch }) {
  const supporters = prisma.$queryRaw<
    { id: string; username: string; tagId?: string }[]
  >`select "User".id, "User"."lastKnownTag" as username, "Tags"."tagId" from "User"
    inner join "Purchases" on "Purchases"."userId" = "User"."id"
    left join "Tags" on "Tags"."userId" = "User"."id" and "Tags"."selected" = true
    left join "Preferences" on "Preferences"."userId" = "User"."id"
    where "Preferences"."leaderboards" = true
    group by "User"."id", "Tags"."tagId"
    order by sum("Purchases".cost) desc`;

  const contributors = prisma.user.findMany({
    where: { Tags: { some: { tagId: "contributor" } } },
    select: {
      lastKnownUsername: true,
      id: true,
      Tags: { where: { selected: true }, select: { tagId: true } },
    },
    orderBy: { adminLevel: "desc" },
  });

  return {
    tags: await getTags(fetch),
    supporters: await supporters,
    contributors: await contributors,
  };
}
