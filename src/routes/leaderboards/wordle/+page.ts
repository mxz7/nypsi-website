import { browser } from "$app/environment";
import sleep from "$lib/functions/sleep.js";
import type { LeaderboardData } from "$lib/types/LeaderboardData.js";

export async function load({ fetch, setHeaders }) {
  const winsData = fetch("/api/leaderboards/wordle/wins").then(
    (r) => r.json() as Promise<LeaderboardData>,
  );
  const speedData = fetch("/api/leaderboards/wordle/time").then(
    (r) => r.json() as Promise<LeaderboardData>,
  );

  if (browser) {
    const res = await Promise.race([Promise.all([winsData, speedData]), sleep(50)]);

    if (typeof res === "boolean") {
      setHeaders({ "x-accel-buffering": "no" });

      return {
        balance: winsData,
        prestige: speedData,
      };
    } else {
      return { balance: await winsData, prestige: await speedData };
    }
  } else {
    return {
      balance: await winsData,
      prestige: await speedData,
    };
  }
}
