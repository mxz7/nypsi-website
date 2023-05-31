import type { LeaderboardData } from "$lib/types/LeaderboardData";
import ms from "ms";

export default async function getBalances(
  fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>
) {
  if (
    localStorage.getItem("top-balances") &&
    JSON.parse(localStorage.getItem("top-balances") as string).stored < Date.now() - ms("15 minutes")
  ) {
    return JSON.parse(localStorage.getItem("top-balances") as string).data as LeaderboardData;
  }

  const data = await fetch("/api/leaderboard/balance").then((r) => r.json());

  if (!Array.isArray(data)) return null;

  localStorage.setItem("top-balances", JSON.stringify({ data, date: Date.now() }));

  return data as LeaderboardData;
}
