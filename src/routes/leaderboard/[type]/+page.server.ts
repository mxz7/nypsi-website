import getItems from "$lib/functions/items.js";
import type { Item } from "$lib/types/Item.js";
import type { LeaderboardData } from "$lib/types/LeaderboardData";
import { error } from "@sveltejs/kit";

export async function load({ params, fetch, isDataRequest, setHeaders }) {
  setHeaders({ "cache-control": "s-maxage=600" });

  let leaderboardData: Promise<LeaderboardData>;

  const { type } = params;
  let items: Item[];
  let item: Item;

  if (type === "balance") {
    leaderboardData = fetch("/api/leaderboard/balance").then(
      (r) => r.json() as Promise<LeaderboardData>,
    );
  } else if (type === "net-worth") {
    leaderboardData = fetch("/api/leaderboard/networth").then(
      (r) => r.json() as Promise<LeaderboardData>,
    );
  } else if (type === "level") {
    leaderboardData = fetch("/api/leaderboard/prestige").then(
      (r) => r.json() as Promise<LeaderboardData>,
    );
  } else if (type === "guilds") {
    leaderboardData = fetch("/api/leaderboard/guild").then(
      (r) => r.json() as Promise<LeaderboardData>,
    );
  } else if (type === "streak") {
    leaderboardData = fetch("/api/leaderboard/streak").then(
      (r) => r.json() as Promise<LeaderboardData>,
    );
  } else if (type === "vote") {
    leaderboardData = fetch("/api/leaderboard/vote").then(
      (r) => r.json() as Promise<LeaderboardData>,
    );
  } else if (type === "wordle") {
    leaderboardData = fetch("/api/leaderboard/wordle").then(
      (r) => r.json() as Promise<LeaderboardData>,
    );
  } else if (type === "lottery") {
    leaderboardData = fetch("/api/leaderboard/lottery").then(
      (r) => r.json() as Promise<LeaderboardData>,
    );
  } else if (type === "commands") {
    leaderboardData = fetch("/api/leaderboard/commands").then(
      (r) => r.json() as Promise<LeaderboardData>,
    );
  } else {
    items = await getItems();

    item = items.find((i) => i.id === type);

    if (!item) return error(404, "unknown item");
    leaderboardData = fetch(`/api/leaderboard/item/${item.id}`).then(
      (r) => r.json() as Promise<LeaderboardData>,
    );
  }

  if (isDataRequest) {
    const data = { items, leaderboardData: leaderboardData, item };
    return data;
  } else {
    const data = { items, leaderboardData: await leaderboardData, item };
    return data;
  }
}
