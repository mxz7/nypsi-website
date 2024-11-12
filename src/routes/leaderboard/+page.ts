import { browser } from "$app/environment";
import type { LeaderboardData } from "$lib/types/LeaderboardData.js";

export const config = {
  runtime: "edge",
  regions: "all",
};

export async function load({ fetch, setHeaders, parent }) {
  setHeaders({ "cache-control": "s-maxage=600" });

  const { items } = await parent();

  if (!browser) {
    return {
      balance: await fetch("/api/leaderboard/balance").then(
        (r) => r.json() as Promise<LeaderboardData>,
      ),
      prestige: await fetch("/api/leaderboard/prestige").then(
        (r) => r.json() as Promise<LeaderboardData>,
      ),
      items,
    };
  } else {
    return {
      balance: fetch("/api/leaderboard/balance").then((r) => r.json() as Promise<LeaderboardData>),
      prestige: fetch("/api/leaderboard/prestige").then(
        (r) => r.json() as Promise<LeaderboardData>,
      ),
      items,
    };
  }
}
