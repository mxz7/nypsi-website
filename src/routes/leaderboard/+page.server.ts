import type { LeaderboardData } from "$lib/types/LeaderboardData.js";

export async function load({ fetch, request, setHeaders }) {
  setHeaders({ "cache-control": "public, max-age=600" });

  if (request.headers.get("user-agent").toLowerCase().includes("bot")) {
    return {
      balance: await fetch("/api/leaderboard/balance").then(
        (r) => r.json() as Promise<LeaderboardData>,
      ),
      prestige: await fetch("/api/leaderboard/prestige").then(
        (r) => r.json() as Promise<LeaderboardData>,
      ),
    };
  } else {
    return {
      balance: fetch("/api/leaderboard/balance").then((r) => r.json() as Promise<LeaderboardData>),
      prestige: fetch("/api/leaderboard/prestige").then(
        (r) => r.json() as Promise<LeaderboardData>,
      ),
    };
  }
}
