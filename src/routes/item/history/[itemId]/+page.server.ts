import getItems from "$lib/functions/items.js";
import getItemHistoryData from "$lib/server/functions/graphs/getItemHistoryData.js";
import { error } from "@sveltejs/kit";

export async function load({ locals, params, url, fetch, setHeaders }) {
  const auth = await locals.validate();

  if (!auth) {
    return { auth: false };
  }

  const premium = await fetch(`/api/user/ispremium/${auth.user.id}`).then((r) => r.json());

  if (!premium.premium) {
    return { premium: false, auth: true };
  }

  setHeaders({ "cache-control": "private, max-age=300, must-revalidate" });

  const items = await getItems(fetch);

  const item = items.find((i) => i.id === params.itemId);

  if (!item) return error(404, "item not found");

  const days = parseInt(url.searchParams.get("days") || "60");

  const graphData = getItemHistoryData(items, item.id, auth.user.id, days);

  return { auth: true, premium: true, graphData: await graphData, item, user: auth.user };
}
