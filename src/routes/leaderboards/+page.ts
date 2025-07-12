import { browser } from "$app/environment";
import sleep from "$lib/functions/sleep.js";
import type { LeaderboardData } from "$lib/types/LeaderboardData.js";

export async function load({ fetch, setHeaders }) {
  const balanceData = fetch("/api/leaderboards/balance").then(
    (r) => r.json() as Promise<LeaderboardData>,
  );
  const guildsData = fetch("/api/leaderboards/guild").then(
    (r) => r.json() as Promise<LeaderboardData>,
  );

  if (browser) {
    const res = await Promise.race([Promise.all([balanceData, guildsData]), sleep(50)]);

    if (typeof res === "boolean") {
      setHeaders({ "x-accel-buffering": "no" });

      return {
        balance: balanceData,
        guilds: guildsData,
      };
    } else {
      return { balance: await balanceData, guilds: await guildsData };
    }
  } else {
    return {
      balance: await balanceData,
      guilds: await guildsData,
    };
  }
}
