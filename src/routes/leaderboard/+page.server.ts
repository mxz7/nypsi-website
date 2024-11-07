import getItems from "$lib/functions/items.js";
import type { LeaderboardData } from "$lib/types/LeaderboardData.js";
import { error } from "@sveltejs/kit";

export async function load({ fetch, isDataRequest, setHeaders, url, depends }) {
  depends("lb");
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
    let data: Promise<LeaderboardData>;

    if (url.searchParams.get("lb") === "balance") {
      data = fetch("/api/leaderboard/balance").then((r) => r.json() as Promise<LeaderboardData>);
    } else if (url.searchParams.get("lb") === "net-worth") {
      data = fetch("/api/leaderboard/networth").then((r) => r.json() as Promise<LeaderboardData>);
    } else if (url.searchParams.get("lb") === "level") {
      data = fetch("/api/leaderboard/prestige").then((r) => r.json() as Promise<LeaderboardData>);
    } else if (url.searchParams.get("lb") === "guilds") {
      data = fetch("/api/leaderboard/guild").then((r) => r.json() as Promise<LeaderboardData>);
    } else if (url.searchParams.get("lb") === "streak") {
      data = fetch("/api/leaderboard/streak").then((r) => r.json() as Promise<LeaderboardData>);
    } else if (url.searchParams.get("lb") === "vote") {
      data = fetch("/api/leaderboard/vote").then((r) => r.json() as Promise<LeaderboardData>);
    } else if (url.searchParams.get("lb") === "wordle") {
      data = fetch("/api/leaderboard/wordle").then((r) => r.json() as Promise<LeaderboardData>);
    } else if (url.searchParams.get("lb") === "lottery") {
      data = fetch("/api/leaderboard/lottery").then((r) => r.json() as Promise<LeaderboardData>);
    } else if (url.searchParams.get("lb") === "commands") {
      data = fetch("/api/leaderboard/commands").then((r) => r.json() as Promise<LeaderboardData>);
    } else if (url.searchParams.get("lb") === "items") {
      if (url.searchParams.get("item")) {
        const items = await getItems();

        if (items.find((i) => i.id === url.searchParams.get("item"))) {
          data = fetch(`/api/leaderboard/item/${url.searchParams.get("item")}`).then(
            (r) => r.json() as Promise<LeaderboardData>,
          );
        } else {
          return error(404, "Unknown Item");
        }
      }
    }

    if (!data) return {};
    if (isDataRequest) {
      return { data, items };
    } else {
      return { data: await data, items };
    }
  }
}
