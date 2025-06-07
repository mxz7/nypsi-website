import prisma from "$lib/server/database.js";
import redis from "$lib/server/redis.js";

export async function load({ parent }) {
  const { user } = await parent();

  if (!user) return;

  return {
    mutes: await getMutes(user.id),
    bans: await getBans(user.id),
  };
}

async function getMutes(userId: string): Promise<
  ({
    guild: {
      name: string;
      icon: string;
    };
  } & {
    userId: string;
    guildId: string;
    expire: Date;
  })[]
> {
  const cache = await redis.get(`cache:punishments:mutes:${userId}`);

  if (cache) return JSON.parse(cache);

  const query = await prisma.moderationMute.findMany({
    where: {
      userId: userId,
    },
    include: {
      guild: {
        select: {
          name: true,
          icon: true,
        },
      },
    },
    orderBy: {
      expire: "asc",
    },
  });

  await redis.set(`cache:punishments:mutes:${userId}`, JSON.stringify(query), "EX", 600);

  return query;
}

async function getBans(userId: string): Promise<
  ({
    guild: {
      name: string;
      icon: string;
    };
  } & {
    userId: string;
    guildId: string;
    expire: Date;
  })[]
> {
  const cache = await redis.get(`cache:punishments:bans:${userId}`);

  if (cache) return JSON.parse(cache);

  const query = await prisma.moderationBan.findMany({
    where: {
      userId: userId,
    },
    include: {
      guild: {
        select: {
          name: true,
          icon: true,
        },
      },
    },
    orderBy: {
      expire: "asc",
    },
  });

  await redis.set(`cache:punishments:bans:${userId}`, JSON.stringify(query), "EX", 600);

  return query;
}
