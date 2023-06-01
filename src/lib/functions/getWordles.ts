import type { LeaderboardData } from "$lib/types/LeaderboardData";
import ms from "ms";

export default async function getWordles(
  fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>
) {
  if (
    localStorage.getItem("top-wordles") &&
    JSON.parse(localStorage.getItem("top-wordles") as string).stored < Date.now() - ms("15 minutes")
  ) {
    return JSON.parse(localStorage.getItem("top-wordles") as string).data as LeaderboardData;
  }

  const data = await fetch("/api/leaderboard/wordle").then((r) => r.json());

  if (!Array.isArray(data)) return null;

  localStorage.setItem("top-wordles", JSON.stringify({ data, date: Date.now() }));

  return data as LeaderboardData;
}
