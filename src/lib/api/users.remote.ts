import { query } from "$app/server";
import { Constants, RedisKey } from "$lib/data/constants";
import prisma from "$lib/server/database";
import redis from "$lib/server/redis";
import { error } from "@sveltejs/kit";
import z from "zod";
import { getAuthedUser } from "./auth.remote";

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
      JSON.stringify(query || {}),
      "EX",
      3600,
    );

    if (!query) {
      return { ok: false, status: 404, message: "unknown username" };
    }

    return { ok: true, id: query.id, username: query.lastKnownUsername };
  },
);

async function getUserIdHelper(userId: string) {
  if (!userId.match(Constants.SNOWFLAKE_REGEX)) {
    const result = await getUserId(userId);

    if (!result.ok) {
      const { status, message } = result as ApiErrorResult;
      error(status, message);
    }

    userId = result.id;
  }

  return userId;
}

export const getBaseData = query(z.string(), async (userId) => {
  userId = await getUserIdHelper(userId);

  const query = await prisma.user.findUnique({
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
      Preferences: {
        select: {
          leaderboards: true,
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
        },
      },
    },
  });

  if (!query) {
    error(404, "unknown user");
  }

  if (query.Preferences && !query.Preferences.leaderboards) {
    const authedUser = await getAuthedUser();

    if (authedUser?.adminLevel < 1) {
      return error(403, "private profile");
    }
  }

  return query;
});

export const getCommandUses = query(z.string(), async (userId) => {
  userId = await getUserIdHelper(userId);

  const query = await prisma.commandUse.groupBy({
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

  return query;
});

export const getAchievements = query(z.string(), async (userId) => {
  userId = await getUserIdHelper(userId);

  const query = await prisma.achievements.findMany({
    where: { userId },
    select: {
      achievementId: true,
      completedAt: true,
      progress: true,
    },
  });

  return query;
});

export const getMarriagePartner = query(z.string(), async (userId) => {
  userId = await getUserIdHelper(userId);

  const marriage = await prisma.marriage.findUnique({
    where: { userId },
    select: { partnerId: true },
  });

  if (marriage) {
    const user = await prisma.user.findUnique({
      where: { id: marriage.partnerId },
      select: { id: true, lastKnownUsername: true },
    });

    return user || null;
  }

  return null;
});
