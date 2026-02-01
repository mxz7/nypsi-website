import { env } from "$env/dynamic/private";
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

export async function GET({ params }) {
  const { itemId } = params;

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

  for (const source of data.sources) {
    if (!oddsData.found[source]) {
      if (
        source.includes("karma shop") ||
        source.includes("streak") ||
        source.includes("fishing") ||
        source.includes("hunting") ||
        source.includes("mining") ||
        source.includes("streak") ||
        source.includes("scrapyard") ||
        source.includes("quarry")
      ) {
        oddsData.found[source] = "";
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
      if (farm.includes(":")) {
        const split = farm.split(":");
        oddsData.found[split[0].trim()] = split[1].trim();
      } else {
        oddsData.found[farm] = farm;
      }
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

  return json(oddsData);
}
