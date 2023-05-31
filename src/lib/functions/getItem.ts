import type { LeaderboardData } from "$lib/types/LeaderboardData";
import ms from "ms";

export default async function getItem(
  fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>,
  itemId: string
) {
  if (
    localStorage.getItem(`top-item-${itemId}`) &&
    JSON.parse(localStorage.getItem(`top-item-${itemId}`) as string).stored < Date.now() - ms("5 minutes")
  ) {
    return JSON.parse(localStorage.getItem(`top-item-${itemId}`) as string).data as LeaderboardData;
  }

  const data = await fetch("/api/leaderboard/item/" + itemId).then((r) => r.json());

  if (!Array.isArray(data)) return null;

  localStorage.setItem(`top-item-${itemId}`, JSON.stringify({ data, date: Date.now() }));

  return data as LeaderboardData;
}
