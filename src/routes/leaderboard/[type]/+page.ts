import { browser } from "$app/environment";
import sleep from "$lib/functions/sleep";
import type { Item } from "$lib/types/Item.js";
import type { LeaderboardData } from "$lib/types/LeaderboardData";
import { error } from "@sveltejs/kit";

export const config = {
  runtime: "edge",
  regions: "all",
};

export async function load({ params, fetch, parent, setHeaders }) {
  let leaderboardData: Promise<LeaderboardData>;

  const { type } = params;
  let items: Item[];
  let item: Item;
  let title: string;
  let descriptor: string;

  if (type === "balance") {
    title = "top balance";

    leaderboardData = fetch("/api/leaderboard/balance").then(
      (r) => r.json() as Promise<LeaderboardData>,
    );
  } else if (type === "net-worth") {
    title = "top net worth";

    leaderboardData = fetch("/api/leaderboard/networth").then(
      (r) => r.json() as Promise<LeaderboardData>,
    );
  } else if (type === "level") {
    title = "top level";

    leaderboardData = fetch("/api/leaderboard/prestige").then(
      (r) => r.json() as Promise<LeaderboardData>,
    );
  } else if (type === "guilds") {
    title = "top guilds";

    leaderboardData = fetch("/api/leaderboard/guild").then(
      (r) => r.json() as Promise<LeaderboardData>,
    );
  } else if (type === "streak") {
    title = "top streak";

    leaderboardData = fetch("/api/leaderboard/streak").then(
      (r) => r.json() as Promise<LeaderboardData>,
    );
  } else if (type === "vote") {
    title = "top monthly votes";
    descriptor = "votes";

    leaderboardData = fetch("/api/leaderboard/vote").then(
      (r) => r.json() as Promise<LeaderboardData>,
    );
  } else if (type === "wordle") {
    title = "top wordle wins";
    descriptor = "wins";

    leaderboardData = fetch("/api/leaderboard/wordle").then(
      (r) => r.json() as Promise<LeaderboardData>,
    );
  } else if (type === "lottery") {
    title = "top lottery wins";
    descriptor = "wins";

    leaderboardData = fetch("/api/leaderboard/lottery").then(
      (r) => r.json() as Promise<LeaderboardData>,
    );
  } else if (type === "commands") {
    title = " top command uses";
    descriptor = "uses";

    leaderboardData = fetch("/api/leaderboard/commands").then(
      (r) => r.json() as Promise<LeaderboardData>,
    );
  } else {
    items = (await parent()).items;

    item = items.find((i) => i.id === type);

    if (!item) return error(404, "unknown item");

    title = `top ${item.name}`;
    descriptor = item.plural || item.name + "s";

    leaderboardData = fetch(`/api/leaderboard/item/${item.id}`).then(
      (r) => r.json() as Promise<LeaderboardData>,
    );
  }

  if (browser) {
    const res = await Promise.race([leaderboardData, sleep(69)]);

    if (typeof res === "boolean") {
      setHeaders({ "x-accel-buffering": "no" });

      return { items, leaderboardData: leaderboardData, item, title, descriptor };
    }

    return { items, leaderboardData: await leaderboardData, item, title, descriptor };
  } else {
    return { items, leaderboardData: await leaderboardData, item, title, descriptor };
  }
}
