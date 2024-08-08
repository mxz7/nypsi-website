import prisma from "$lib/server/database";
import { getTags } from "$lib/stores";

const contributorIds = ["672793821850894347", "499720078770831360", "191179161010831360"];

export async function load() {
  const supporters = prisma.user.findMany({
    where: {
      AND: [{ totalSpend: { gt: 0 } }, { Preferences: { leaderboards: true } }],
    },
    select: {
      lastKnownUsername: true,
      id: true,
      Tags: {
        where: {
          selected: true,
        },
        select: {
          tagId: true,
        },
      },
    },
    orderBy: { totalSpend: "desc" },
  });

  const contributors = prisma.user.findMany({
    where: { id: { in: contributorIds } },
    select: {
      lastKnownUsername: true,
      id: true,
      Tags: { where: { selected: true }, select: { tagId: true } },
    },
    orderBy: { adminLevel: "desc" },
  });

  return {
    tags: await getTags(),
    supporters: await supporters,
    contributors: await contributors,
  };
}
