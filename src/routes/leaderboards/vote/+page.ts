import { browser } from "$app/environment";
import sleep from "$lib/functions/sleep.js";
import type { LeaderboardData } from "$lib/types/LeaderboardData.js";

export async function load({ fetch, setHeaders }) {
  const monthly = fetch("/api/leaderboards/vote/month").then(
    (r) => r.json() as Promise<LeaderboardData>,
  );
  const streak = fetch("/api/leaderboards/vote/streak").then(
    (r) => r.json() as Promise<LeaderboardData>,
  );

  if (browser) {
    const res = await Promise.race([Promise.all([monthly, streak]), sleep(50)]);

    if (typeof res === "boolean") {
      setHeaders({ "x-accel-buffering": "no" });

      return {
        balance: monthly,
        prestige: streak,
      };
    } else {
      return { balance: await monthly, prestige: await streak };
    }
  } else {
    return {
      balance: await monthly,
      prestige: await streak,
    };
  }
}
