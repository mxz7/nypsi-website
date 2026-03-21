import { query } from "$app/server";
import { getAuthedUser } from "$lib/api/auth.remote";
import { getUserId } from "$lib/api/users.remote";
import { Constants } from "$lib/data/constants";
import prisma from "$lib/server/database";
import { error } from "@sveltejs/kit";
import z from "zod";

export const getBaseData = query(z.string(), async (userId) => {
  if (!userId.match(Constants.SNOWFLAKE_REGEX)) {
    const result = await getUserId(userId);

    if (!result.ok) {
      const { status, message } = result as ApiErrorResult;
      error(status, message);
    }

    userId = result.id;
  }

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
