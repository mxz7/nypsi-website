import { query } from "$app/server";
import { RedisKey } from "$lib/data/constants";
import prisma from "$lib/server/database";
import { redisDeserialize, redisSerialize } from "$lib/server/functions/redis-json";
import redis from "$lib/server/redis";
import { error } from "@sveltejs/kit";
import z from "zod";
import { checkPrivacyHelper, getUserIdHelper } from "./helpers";

export const getUserId = query<z.ZodString, ApiResult<{ id: string; username: string }>>(
  z.string().toLowerCase(),
  async (username) => {
    const cache = await redis.get(`${RedisKey.users.USERNAME_TO_ID}:${username}`);

    if (cache) {
      const cacheData = JSON.parse(cache);

      if (cacheData.id) {
        return { ok: true, id: cacheData.id, username: cacheData.lastKnownUsername };
      }

      return { ok: false, status: 404, message: "unknown username" };
    }

    const query = await prisma.user.findFirst({
      where: {
        lastKnownUsername: { equals: username, mode: "insensitive" },
      },
      select: {
        id: true,
        lastKnownUsername: true,
      },
    });

    await redis.set(
      `${RedisKey.users.USERNAME_TO_ID}:${username}`,
      redisSerialize(query || {}),
      "EX",
      3600,
    );

    if (!query) {
      return { ok: false, status: 404, message: "unknown username" };
    }

    return { ok: true, id: query.id, username: query.lastKnownUsername };
  },
);

export const getPrivacy = query(z.string(), async (userId) => {
  userId = await getUserIdHelper(userId);

  const cache = await redis.get(`${RedisKey.users.PRIVACY}:${userId}`);

  if (cache) {
    const data = redisDeserialize<boolean>(cache);

    return data;
  }

  const query = await prisma.preferences
    .findUnique({ where: { userId }, select: { leaderboards: true } })
    .then((res) => res?.leaderboards || false);

  await redis.set(`${RedisKey.users.PRIVACY}:${userId}`, redisSerialize(query), "EX", 600);

  return query;
});

function getBaseDataFromDatabase(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      avatar: true,
      blacklisted: true,
      lastCommand: true,
      id: true,
      lastKnownUsername: true,
      Tags: {
        select: {
          selected: true,
          tagId: true,
        },
      },
      Premium: {
        select: {
          level: true,
          embedColor: true,
        },
      },
      Economy: {
        select: {
          prestige: true,
          level: true,
          money: true,
          netWorth: true,
          bank: true,
          dailyStreak: true,
          voteStreak: true,
          EconomyGuildMember: {
            select: {
              guildName: true,
            },
          },
        },
      },
    },
  });
}

export const getBaseData = query(z.string(), async (userId) => {
  userId = await getUserIdHelper(userId);
  await checkPrivacyHelper(userId);

  const cache = await redis.get(`${RedisKey.users.BASE_DATA}:${userId}`);

  if (cache) {
    const cacheData = redisDeserialize<Awaited<ReturnType<typeof getBaseDataFromDatabase>> | null>(
      cache,
    );

    if (!cacheData) {
      error(404, "unknown user");
    }

    return cacheData;
  }

  const query = await getBaseDataFromDatabase(userId);

  if (!query) {
    error(404, "unknown user");
  }

  await redis.set(
    `${RedisKey.users.BASE_DATA}:${userId}`,
    redisSerialize(query || null),
    "EX",
    600,
  );

  return query;
});

function getCommandUsesFromDatabase(userId: string) {
  return prisma.commandUse.groupBy({
    by: ["command"],
    _sum: {
      uses: true,
    },
    orderBy: {
      _sum: {
        uses: "desc",
      },
    },
    where: {
      userId,
    },
  });
}

export const getCommandUses = query(z.string(), async (userId) => {
  userId = await getUserIdHelper(userId);
  await checkPrivacyHelper(userId);

  const cache = await redis.get(`${RedisKey.users.COMMAND_USES}:${userId}`);

  if (cache) {
    return redisDeserialize<Awaited<ReturnType<typeof getCommandUsesFromDatabase>>>(cache);
  }

  const query = await getCommandUsesFromDatabase(userId);

  await redis.set(`${RedisKey.users.COMMAND_USES}:${userId}`, redisSerialize(query), "EX", 600);

  return query;
});

function getAchievementsFromDatabase(userId: string) {
  return prisma.achievements.findMany({
    where: { userId },
    select: {
      achievementId: true,
      completedAt: true,
      progress: true,
    },
  });
}

export const getAchievements = query(z.string(), async (userId) => {
  userId = await getUserIdHelper(userId);
  await checkPrivacyHelper(userId);

  const cache = await redis.get(`${RedisKey.users.ACHIEVEMENTS}:${userId}`);

  if (cache) {
    return redisDeserialize<Awaited<ReturnType<typeof getAchievementsFromDatabase>>>(cache);
  }

  const query = await getAchievementsFromDatabase(userId);

  await redis.set(`${RedisKey.users.ACHIEVEMENTS}:${userId}`, redisSerialize(query), "EX", 600);

  return query;
});

function getInventoryFromDatabase(userId: string) {
  return prisma.inventory.findMany({
    where: { userId },
    select: { item: true, amount: true },
    orderBy: { item: "asc" },
  });
}

export const getInventory = query(z.string(), async (userId) => {
  userId = await getUserIdHelper(userId);
  await checkPrivacyHelper(userId);

  const cache = await redis.get(`${RedisKey.users.INVENTORY}:${userId}`);

  if (cache) {
    return redisDeserialize<Awaited<ReturnType<typeof getInventoryFromDatabase>>>(cache);
  }

  const query = await getInventoryFromDatabase(userId);

  await redis.set(`${RedisKey.users.INVENTORY}:${userId}`, redisSerialize(query), "EX", 600);

  return query;
});

function getMuseumFromDatabase(userId: string) {
  return prisma.museum.findMany({
    where: { userId },
    select: {
      itemId: true,
      amount: true,
      completedAt: true,
      favorited: true,
    },
    orderBy: { itemId: "asc" },
  });
}

export const getMuseum = query(z.string(), async (userId) => {
  userId = await getUserIdHelper(userId);
  await checkPrivacyHelper(userId);

  const cache = await redis.get(`${RedisKey.users.MUSEUM}:${userId}`);

  if (cache) {
    return redisDeserialize<Awaited<ReturnType<typeof getMuseumFromDatabase>>>(cache);
  }

  const query = await getMuseumFromDatabase(userId);

  await redis.set(`${RedisKey.users.MUSEUM}:${userId}`, redisSerialize(query), "EX", 600);

  return query;
});

export const getMarriagePartner = query(z.string(), async (userId) => {
  userId = await getUserIdHelper(userId);

  const cache = await redis.get(`${RedisKey.users.MARRIAGE_PARTNER}:${userId}`);

  if (cache) {
    const cacheData = redisDeserialize<{ id: string; lastKnownUsername: string } | null>(cache);
    return cacheData;
  }

  const marriage = await prisma.marriage.findUnique({
    where: { userId },
    select: { partnerId: true },
  });

  if (marriage) {
    const user = await prisma.user.findUnique({
      where: { id: marriage.partnerId },
      select: { id: true, lastKnownUsername: true },
    });

    await redis.set(
      `${RedisKey.users.MARRIAGE_PARTNER}:${userId}`,
      redisSerialize(user || null),
      "EX",
      600,
    );

    return user || null;
  }

  await redis.set(`${RedisKey.users.MARRIAGE_PARTNER}:${userId}`, redisSerialize(null), "EX", 600);

  return null;
});
