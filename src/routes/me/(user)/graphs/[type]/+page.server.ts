import { getItemsRemote } from "$lib/api/items.remote";
import getItemCountDataForUser from "$lib/server/functions/graphs/getItemCountDataForUser.js";
import { redirect } from "@sveltejs/kit";

export async function load({ parent, setHeaders, params, url }) {
  try {
    setHeaders({
      "cache-control": "private, max-age=3600, must-revalidate",
    });
  } catch {}

  const parentData = await parent();

  if (!parentData.user) return;
  if (!parentData.premium) return redirect(302, "/me/graphs");

  const days = parseInt(url.searchParams.get("days")) || 30;
  const items = await getItemsRemote();

  if (params.type === "balance") {
    return {
      chartData: await getItemCountDataForUser(["user-money"], parentData.user.id, items, days),
      options: "money",
    };
  } else if (params.type === "net") {
    return {
      chartData: await getItemCountDataForUser(["user-net"], parentData.user.id, items, days),
      options: "money",
    };
  } else if (params.type === "level") {
    return {
      chartData: await getItemCountDataForUser(["user-level"], parentData.user.id, items, days),
      options: "karma",
    };
  } else if (params.type === "karma") {
    return {
      chartData: await getItemCountDataForUser(["user-karma"], parentData.user.id, items, days),
      options: "karma",
    };
  } else {
    return redirect(302, "/me/graphs");
  }
}
