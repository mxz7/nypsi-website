import { query } from "$app/server";
import { getAuthedUser } from "$lib/api/auth.remote";
import {
  getItemLeaderboard,
  getLeaderboard,
  getLeaderboardMetadata,
} from "$lib/api/leaderboards/leaderboards.remote";
import { getItemUserPosition, getKnownUserPosition } from "$lib/api/leaderboards/positions.remote";
import type { LeaderboardType } from "$lib/api/leaderboards/shared";
import z from "zod";

export const getData = query(z.string(), async (type) => {
  const authedUser = await getAuthedUser();
  const meta = await getLeaderboardMetadata(type);

  const [data, userPosition] = await Promise.all([
    meta.typeKind === "known" ? getLeaderboard(type as LeaderboardType) : getItemLeaderboard(type),
    authedUser
      ? meta.typeKind === "known"
        ? getKnownUserPosition(type as LeaderboardType)
        : getItemUserPosition(type)
      : Promise.resolve(null),
  ]);

  return { data, userPosition };
});
