import { query } from "$app/server";
import { getAuthedUser } from "$lib/api/auth.remote";
import { getUserId as getUserIdRemote } from "$lib/api/users.remote";
import { Constants } from "$lib/data/constants";
import prisma from "$lib/server/database";
import { error } from "@sveltejs/kit";
import z from "zod";

async function getUserId(userId: string) {
  if (!userId.match(Constants.SNOWFLAKE_REGEX)) {
    const result = await getUserIdRemote(userId);

    if (!result.ok) {
      const { status, message } = result as ApiErrorResult;
      error(status, message);
    }

    userId = result.id;
  }

  return userId;
}

export const getBaseData = query(z.string(), async (userId) => {
  userId = await getUserId(userId);

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
  userId = await getUserId(userId);

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
  userId = await getUserId(userId);

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
