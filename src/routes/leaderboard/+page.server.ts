import getItems from "$lib/functions/items.js";
import type { LeaderboardData } from "$lib/types/LeaderboardData.js";

export async function load({ fetch, isDataRequest, setHeaders, url }) {
  setHeaders({ "cache-control": "s-maxage=600" });

  const items = await getItems();

  if (!isDataRequest) {
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
