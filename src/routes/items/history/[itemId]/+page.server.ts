import getItems from "$lib/functions/items.js";
import getItemHistoryData from "$lib/server/functions/graphs/getItemHistoryData.js";
import redis from "$lib/server/redis.js";
import { error } from "@sveltejs/kit";

export async function load({ locals, params, url, fetch, setHeaders }) {
  const items = await getItems(fetch);

  const item = items.find((i) => i.id === params.itemId);

  if (!item) return error(404, "item not found");

  const days = parseInt(url.searchParams.get("days") || "60");

  const cache = await redis.get(`cache:item:history:${item.id}:${days}`);

  if (cache) {
    return { auth: true, premium: true, graphData: JSON.parse(cache), item };
  }

  const graphData = await getItemHistoryData(items, item.id, days);

  redis.set(`cache:item:history:${item.id}:${days}`, JSON.stringify(graphData), "EX", 60 * 60 * 12);

  return { auth: true, premium: true, graphData: graphData, item };
}
