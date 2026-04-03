import { query } from "$app/server";
import { getAuthedUser } from "$lib/api/auth.remote";
import {
  getItemLeaderboard,
  getLeaderboard,
  getLeaderboardMetadata,
} from "$lib/api/leaderboards/leaderboards.remote";
import { getItemUserPosition, getKnownUserPosition } from "$lib/api/leaderboards/positions.remote";
import type { LeaderboardType } from "$lib/api/leaderboards/shared";
import { getBaseData } from "$lib/api/users.remote";
import type { LeaderboardData, LeaderboardPosition } from "$lib/types/leaderboards";
import type { BaseUserData } from "$lib/types/User";
import z from "zod";

export const getData = query(z.string(), async (type) => {
  const [authedUser, meta] = await Promise.all([getAuthedUser(), getLeaderboardMetadata(type)]);

  let leaderboardDataPromise: Promise<LeaderboardData>;
  let userPositionPromise: Promise<LeaderboardPosition>;
  let userDataPromise: Promise<BaseUserData>;

  if (meta.typeKind === "known") {
    leaderboardDataPromise = getLeaderboard(type as LeaderboardType);
  } else {
    leaderboardDataPromise = getItemLeaderboard(type);
  }

  if (authedUser) {
    // TODO: we only need tag, make a tag query instead of base data. also use the redis cache class instead of the serialize/deserialize
    userDataPromise = getBaseData(authedUser.id);

    if (meta.typeKind === "known") {
      userPositionPromise = getKnownUserPosition(type as LeaderboardType);
    } else {
      userPositionPromise = getItemUserPosition(type);
    }
  }

  const [data, userPosition, userData] = await Promise.all([
    leaderboardDataPromise,
    userPositionPromise,
    userDataPromise,
  ]);

  return { data, userPosition, userData };
});
