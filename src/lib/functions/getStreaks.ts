import type { LeaderboardData } from "$lib/types/LeaderboardData";
import ms from "ms";

export default async function getStreaks(
  fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>
) {
  if (
    localStorage.getItem("top-streaks") &&
    JSON.parse(localStorage.getItem("top-streaks") as string).stored < Date.now() - ms("15 minutes")
  ) {
    return JSON.parse(localStorage.getItem("top-streaks") as string).data as LeaderboardData;
  }

  const data = await fetch("/api/leaderboard/streak").then((r) => r.json());

  if (!Array.isArray(data)) return null;

  localStorage.setItem("top-streaks", JSON.stringify({ data, date: Date.now() }));

  return data as LeaderboardData;
}
