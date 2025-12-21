import getItems from "$lib/functions/items.js";
import getItemHistoryData from "$lib/server/functions/graphs/getItemHistoryData.js";
import { error } from "@sveltejs/kit";

export async function load({ params, url, fetch }) {
  const items = await getItems(fetch);

  const item = items.find((i) => i.id === params.itemId);

  if (!item) return error(404, "item not found");

  const days = parseInt(url.searchParams.get("days") || "60");

  const chartData = await getItemHistoryData(items, item.id, days);

  return { auth: true, premium: true, chartData, item };
}
