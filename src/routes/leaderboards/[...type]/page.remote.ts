import { query } from "$app/server";
import { getAuthedUser } from "$lib/api/auth.remote";
import {
  getItemLeaderboard,
  getLeaderboard,
  getLeaderboardMetadata,
} from "$lib/api/leaderboards/leaderboards.remote";
import { getItemUserPosition, getKnownUserPosition } from "$lib/api/leaderboards/positions.remote";
import type { LeaderboardType } from "$lib/api/leaderboards/shared";
import type { LeaderboardData, LeaderboardPosition } from "$lib/types/leaderboards";
import z from "zod";

export const getData = query(z.string(), async (type) => {
  const [authedUser, meta] = await Promise.all([getAuthedUser(), getLeaderboardMetadata(type)]);

  let leaderboardDataPromise: Promise<LeaderboardData>;
  let userPositionPromise: Promise<LeaderboardPosition>;

  if (meta.typeKind === "known") {
    leaderboardDataPromise = getLeaderboard(type as LeaderboardType);
  } else {
    leaderboardDataPromise = getItemLeaderboard(type);
  }

  if (authedUser) {
    if (meta.typeKind === "known") {
      userPositionPromise = getKnownUserPosition(type as LeaderboardType);
    } else {
      userPositionPromise = getItemUserPosition(type);
    }
  }

  const [data, userPosition] = await Promise.all([leaderboardDataPromise, userPositionPromise]);

  return { data, userPosition };
});
