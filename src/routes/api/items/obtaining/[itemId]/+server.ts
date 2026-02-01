import { dev } from "$app/environment";
import { env } from "$env/dynamic/private";
import redis from "$lib/server/redis.js";
import { json } from "@sveltejs/kit";

type ApiData = {
  sources: string[];
  workers: string[];
  farm: string[];
  obtaining: Array<{ itemId: string; chance: number }>;
  pools: Array<{
    poolName: string;
    count: number;
    breakdown: Array<{ itemId: string; chance: number }>;
  }>;
};

export async function GET({ params, setHeaders }) {
  const { itemId } = params;

  const cache = await redis.get(`cache:obtaining:${itemId}`);

  if (cache) {
    return json(JSON.parse(cache));
  }

  const response = await fetch(`${env.BOT_SERVER_URL}/items/${itemId}/obtaining`, {
    headers: {
      Authorization: `Bearer ${env.BOT_API_AUTH}`,
    },
  });

  if (!response.ok) {
    return new Response(null, { status: response.status });
  }

  const data: ApiData = await response.json();

  const { pools, obtaining } = data;

  const oddsData: {
    crate_open?: {
      itemId: string;
      chance: string;
    }[];
    found: {
      [key: string]: string;
    };
  } = { found: {} };

  for (let source of data.sources) {
    if (!oddsData.found[source]) {
      source = source.replaceAll("<:iron_pickaxe:1354809169198186607>", "⛏️");

      if (
        source.includes("karma shop") ||
        source.includes("streak") ||
        source.includes("fishing") ||
        source.includes("hunting") ||
        source.includes("mining") ||
        source.includes("streak") ||
        source.includes("scrapyard") ||
        source.includes("quarry") ||
        source.includes("baking") ||
        source.includes("shop")
      ) {
        oddsData.found[source] = "";
      } else if (source.includes("divorce")) {
        oddsData.found["💍 divorce"] = "";
      } else if (source.includes("crafting")) {
        oddsData.found["crafting"] = "";
      } else if (source.includes("mysterious activities")) {
        continue;
      } else if (source.includes("nypsi store")) {
        oddsData.found["💰 nypsi store"] = "";
      } else {
        if (source.includes(":")) {
          const split = source.split(":");
          oddsData.found[split[0].trim()] = split[1].trim().replaceAll("`", "");
        } else {
          oddsData.found[source] = source;
        }
      }
    }
  }

  for (const worker of data.workers) {
    if (!oddsData.found[worker]) {
      if (worker.includes(":")) {
        const split = worker.split(":");
        oddsData.found[split[0].trim()] = split[1].trim();
      } else {
        oddsData.found[worker] = worker;
      }
    }
  }

  for (const farm of data.farm) {
    if (!oddsData.found[farm]) {
      oddsData[farm] = "";
    }
  }

  for (const item of obtaining) {
    if (!oddsData.found[item.itemId]) {
      oddsData.found[item.itemId] = `${item.chance.toFixed(4)}%`;
    }
  }

  for (const pool of pools) {
    for (const item of pool.breakdown) {
      if (!oddsData.crate_open) {
        oddsData.crate_open = [];
      }
      oddsData.crate_open.push({ itemId: item.itemId, chance: `${item.chance.toFixed(4)}%` });
    }
  }

  if (!dev) {
    await redis.set(`cache:item:obtaining:${itemId}`, JSON.stringify(oddsData), "EX", 3600);
  }

  setHeaders({
    "cache-control": "public, max-age=3600, must-revalidate",
  });

  return json(oddsData);
}
