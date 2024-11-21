import { browser } from "$app/environment";
import sleep from "$lib/functions/sleep.js";
import type { LeaderboardData } from "$lib/types/LeaderboardData.js";

export async function load({ fetch, setHeaders }) {
  setHeaders({ "cache-control": "s-maxage=600" });

  const balanceData = fetch("/api/leaderboard/balance").then(
    (r) => r.json() as Promise<LeaderboardData>,
  );
  const prestigeData = fetch("/api/leaderboard/prestige").then(
    (r) => r.json() as Promise<LeaderboardData>,
  );

  if (browser) {
    const res = await Promise.race([balanceData, prestigeData, sleep(69)]);

    if (typeof res === "boolean") {
      return {
        balance: balanceData,
        prestige: prestigeData,
      };
    } else {
      return { balance: await balanceData, prestige: await prestigeData };
    }
  } else {
    return {
      balance: await balanceData,
      prestige: await prestigeData,
    };
  }
}
