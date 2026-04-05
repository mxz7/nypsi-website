import { query } from "$app/server";
import { getAuthedUser } from "$lib/api/auth.remote";
import {
  getItemLeaderboard,
  getLeaderboard,
  getLeaderboardMetadata,
} from "$lib/api/leaderboards/leaderboards.remote";
import { getItemUserPosition, getKnownUserPosition } from "$lib/api/leaderboards/positions.remote";
import type { LeaderboardType } from "$lib/api/leaderboards/shared";
import { getActiveTag } from "$lib/api/users.remote";
import type { LeaderboardData, LeaderboardPosition } from "$lib/types/leaderboards";
import z from "zod";

export const getData = query(z.string(), async (type) => {
  const [authedUser, meta] = await Promise.all([getAuthedUser(), getLeaderboardMetadata(type)]);

  let leaderboardDataPromise: Promise<LeaderboardData>;
  let userPositionPromise: Promise<LeaderboardPosition>;
  let userTagPromise: ReturnType<typeof getActiveTag>;

  if (meta.typeKind === "known") {
    leaderboardDataPromise = getLeaderboard(type as LeaderboardType);
  } else {
    leaderboardDataPromise = getItemLeaderboard(type);
  }

  if (authedUser) {
    userTagPromise = getActiveTag(authedUser.id);

    if (meta.typeKind === "known") {
      userPositionPromise = getKnownUserPosition(type as LeaderboardType);
    } else {
      userPositionPromise = getItemUserPosition(type);
    }
  }

  const [data, userPosition, userTag] = await Promise.all([
    leaderboardDataPromise,
    userPositionPromise,
    userTagPromise,
  ]);

  return {
    data,
    userPosition,
    userData: authedUser
      ? { id: authedUser.id, username: authedUser.lastKnownUsername, tag: userTag }
      : null,
  };
});
