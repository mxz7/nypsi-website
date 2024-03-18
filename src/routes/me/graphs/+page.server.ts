import getItemCountDataForUser from "$lib/server/functions/graphs/getItemCountDataForUser.js";
import { redirect } from "@sveltejs/kit";

export const ssr = false;

export async function load({ setHeaders, parent, url }) {
  const parentData = await parent();

  console.log(parentData);

  if (!parentData.user) return redirect(303, "/me");

  if (!parentData.baseData?.Premium?.level) return redirect(303, "/me");

  const days = parseInt(url.searchParams.get("days")) || 30;

  if (days === 30)
    setHeaders({
      "cache-control": "max-age=3600",
    });

  if (url.searchParams.get("items")) {
    const categories: string[] = [];

    for (const itemId of url.searchParams.get("items").split(" ")) {
      if (!parentData.items.find((i) => i.id === itemId) || categories.length >= 10) {
        url.searchParams.set(
          "items",
          url.searchParams.get("items").replace(itemId, "").replaceAll("  ", " "),
        );
      } else {
        categories.push(`user-item-${parentData.items.find((i) => i.id === itemId).id}`);
      }
    }

    return {
      itemsData: getItemCountDataForUser(categories, parentData.user.id, parentData.items, days),
    };
  } else {
    return {
      balance: getItemCountDataForUser(["user-money"], parentData.user.id, parentData.items, days),
      networth: getItemCountDataForUser(["user-net"], parentData.user.id, parentData.items, days),
      karma: getItemCountDataForUser(["user-karma"], parentData.user.id, parentData.items, days),
      level: getItemCountDataForUser(["user-level"], parentData.user.id, parentData.items, days),
    };
  }
}
