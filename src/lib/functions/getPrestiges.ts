import type { LeaderboardData } from "$lib/types/LeaderboardData";
import ms from "ms";

export default async function getPrestiges(
  fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>
) {
  if (
    localStorage.getItem("top-prestiges") &&
    JSON.parse(localStorage.getItem("top-prestiges") as string).stored < Date.now() - ms("5 minutes")
  ) {
    return JSON.parse(localStorage.getItem("top-prestiges") as string).data as LeaderboardData;
  }
  const data = await fetch("/api/leaderboard/prestige").then((r) => r.json());

  if (!Array.isArray(data)) return null;

  localStorage.setItem("top-prestiges", JSON.stringify({ data, date: Date.now() }));

  return data as LeaderboardData;
}
