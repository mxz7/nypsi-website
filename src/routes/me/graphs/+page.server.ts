import getItems from "$lib/functions/getItems.js";
import getItemCountDataForUser from "$lib/server/functions/graphs/getItemCountDataForUser.js";
import { redirect } from "@sveltejs/kit";

export const ssr = false;

export async function load({ setHeaders, parent, url }) {
  const [parentData, items] = await Promise.all([parent(), getItems()]);

  if (!parentData.user.authenticated) throw redirect(303, "/me");

  if (!(await Promise.resolve(parentData.streamed.premium))) throw redirect(303, "/me");

  setHeaders({
    "cache-control": "max-age=3600",
  });

  if (url.searchParams.get("items")) {
    const categories: string[] = [];

    for (const itemId of url.searchParams.get("items").split(" ")) {
      if (!items.find((i) => i.id === itemId) || categories.length >= 10) {
        url.searchParams.set(
          "items",
          url.searchParams.get("items").replace(itemId, "").replaceAll("  ", " "),
        );
      } else {
        categories.push(`user-item-${items.find((i) => i.id === itemId).id}`);
      }
    }

    return {
      streamed: {
        items: getItemCountDataForUser(categories, parentData.user.id, items),
      },
    };
  } else {
    return {
      streamed: {
        balance: getItemCountDataForUser(["user-money"], parentData.user.id, items),
        networth: getItemCountDataForUser(["user-net"], parentData.user.id, items),
        karma: getItemCountDataForUser(["user-karma"], parentData.user.id, items),
      },
    };
  }
}
