import {
  getItemLeaderboard,
  getLeaderboard,
  type LeaderboardType,
} from "$lib/api/leaderboards.remote";
import type { Item } from "$lib/types/Item.js";
import type { LeaderboardData } from "$lib/types/LeaderboardData";
import { error } from "@sveltejs/kit";

const knownTypes: Record<string, { title: string; descriptor?: string }> = {
  balance: { title: "top balance" },
  "net-worth": { title: "top net worth" },
  level: { title: "top level" },
  guilds: { title: "top guilds" },
  streak: { title: "top daily streak" },
  lottery: { title: "top lottery wins", descriptor: "wins" },
  commands: { title: "top command uses", descriptor: "uses" },
};

export async function load({ params, parent }) {
  let leaderboardData: Promise<LeaderboardData>;

  const { type } = params;
  let items: Item[];
  let item: Item;
  let title: string;
  let descriptor: string;

  if (type in knownTypes) {
    const meta = knownTypes[type];
    title = meta.title;
    descriptor = meta.descriptor;
    leaderboardData = getLeaderboard(type as LeaderboardType);
  } else {
    // item leaderboard
    items = (await parent()).items;
    item = items.find((i: Item) => i.id === type);
    if (!item) return error(404, "unknown item");
    title = `top ${item.name}`;
    descriptor = item.plural || item.name + "s";
    leaderboardData = getItemLeaderboard(item.id);
  }

  return { items, leaderboardData, item, title, descriptor };
}
