import getItems from "$lib/functions/getItems.js";
import type { LeaderboardData } from "$lib/types/LeaderboardData.js";

export const config = {
  runtime: "edge",
  regions: "all",
};

export async function load({ fetch }) {
  return {
    balance: fetch("/api/leaderboard/balance").then((r) => r.json() as Promise<LeaderboardData>),
    net: fetch("/api/leaderboard/networth").then((r) => r.json() as Promise<LeaderboardData>),
    prestige: fetch("/api/leaderboard/prestige").then((r) => r.json() as Promise<LeaderboardData>),
    items: getItems(),
    tags: fetch("https://raw.githubusercontent.com/tekoh/nypsi/main/data/tags.json")
      .then((r) => r.text())
      .then(
        (r) =>
          JSON.parse(r) as Promise<{
            [key: string]: { tagId: string; emoji: string; name: string };
          }>,
      ),
  };
}
