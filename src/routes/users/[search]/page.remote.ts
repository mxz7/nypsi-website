import { query } from "$app/server";
import { getAchievements, getBaseData, getCommandUses, getUserId } from "$lib/api/users.remote";
import { Constants } from "$lib/data/constants";
import { error } from "@sveltejs/kit";
import z from "zod";

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

export const data = query(z.string(), async (userId) => {
  userId = await getUserIdHelper(userId);

  const [baseData, commandsData, achievements] = await Promise.all([
    getBaseData(userId),
    getCommandUses(userId),
    getAchievements(userId),
  ]);

  return { baseData, commandsData, achievements };
});
