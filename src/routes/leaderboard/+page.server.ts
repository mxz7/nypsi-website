import getItems from "$lib/functions/items.js";
import type { LeaderboardData } from "$lib/types/LeaderboardData.js";
import { error } from "@sveltejs/kit";

export async function load({ fetch, isDataRequest, setHeaders, url }) {
  setHeaders({ "cache-control": "s-maxage=600" });

  const items = await getItems();

  if (!url.searchParams.has("lb")) {
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
        balance: fetch("/api/leaderboard/balance").then(
          (r) => r.json() as Promise<LeaderboardData>,
        ),
        prestige: fetch("/api/leaderboard/prestige").then(
          (r) => r.json() as Promise<LeaderboardData>,
        ),
        items,
      };
    }
  } else {
    let leaderboardData: Promise<LeaderboardData>;

    if (url.searchParams.get("lb") === "balance") {
      leaderboardData = fetch("/api/leaderboard/balance").then(
        (r) => r.json() as Promise<LeaderboardData>,
      );
    } else if (url.searchParams.get("lb") === "net-worth") {
      leaderboardData = fetch("/api/leaderboard/networth").then(
        (r) => r.json() as Promise<LeaderboardData>,
      );
    } else if (url.searchParams.get("lb") === "level") {
      leaderboardData = fetch("/api/leaderboard/prestige").then(
        (r) => r.json() as Promise<LeaderboardData>,
      );
    } else if (url.searchParams.get("lb") === "guilds") {
      leaderboardData = fetch("/api/leaderboard/guild").then(
        (r) => r.json() as Promise<LeaderboardData>,
      );
    } else if (url.searchParams.get("lb") === "streak") {
      leaderboardData = fetch("/api/leaderboard/streak").then(
        (r) => r.json() as Promise<LeaderboardData>,
      );
    } else if (url.searchParams.get("lb") === "vote") {
      leaderboardData = fetch("/api/leaderboard/vote").then(
        (r) => r.json() as Promise<LeaderboardData>,
      );
    } else if (url.searchParams.get("lb") === "wordle") {
      leaderboardData = fetch("/api/leaderboard/wordle").then(
        (r) => r.json() as Promise<LeaderboardData>,
      );
    } else if (url.searchParams.get("lb") === "lottery") {
      leaderboardData = fetch("/api/leaderboard/lottery").then(
        (r) => r.json() as Promise<LeaderboardData>,
      );
    } else if (url.searchParams.get("lb") === "commands") {
      leaderboardData = fetch("/api/leaderboard/commands").then(
        (r) => r.json() as Promise<LeaderboardData>,
      );
    } else if (url.searchParams.get("lb") === "items") {
      if (url.searchParams.get("item")) {
        if (items.find((i) => i.id === url.searchParams.get("item"))) {
          leaderboardData = fetch(`/api/leaderboard/item/${url.searchParams.get("item")}`).then(
            (r) => r.json() as Promise<LeaderboardData>,
          );
        } else {
          return error(404, "Unknown Item");
        }
      }
    }

    if (!leaderboardData) return {};

    if (isDataRequest) {
      const data = { items };
      data[`lb-${url.searchParams.get("lb")}`] = leaderboardData;
      return data;
    } else {
      const data = { items };
      data[`lb-${url.searchParams.get("lb")}`] = await leaderboardData;
      return data;
    }
  }
}
