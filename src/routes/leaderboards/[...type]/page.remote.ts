import { query } from "$app/server";
import {
  getItemLeaderboard,
  getLeaderboard,
  getLeaderboardMetadata,
  type LeaderboardType,
} from "$lib/api/leaderboards.remote";
import z from "zod";

export const getData = query(z.string(), async (type) => {
  const meta = await getLeaderboardMetadata(type);

  if (meta.typeKind === "known") {
    return getLeaderboard(type as LeaderboardType);
  } else {
    return getItemLeaderboard(type);
  }
});
