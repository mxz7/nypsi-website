import getItems from "$lib/functions/items.js";
import getItemCountDataForUser from "$lib/server/functions/graphs/getItemCountDataForUser.js";
import { redirect } from "@sveltejs/kit";

export async function load({ parent, url, setHeaders, fetch }) {
  try {
    setHeaders({
      "cache-control": "private, max-age=3600",
    });
  } catch {}

  const parentData = await parent();
  if (!parentData.user) return;
  if (!parentData.premium) return redirect(302, "/me/graphs");

  const days = parseInt(url.searchParams.get("days")) || 30;
  const itemId = url.searchParams.get("item");

  if (itemId) {
    const items = await getItems(fetch);

    const itemData = items.find((i) => i.id === itemId);

    if (itemData) {
      return {
        chartData: await getItemCountDataForUser(
          [`user-item-${itemData.id}`],
          parentData.user.id,
          items,
          days,
        ),
        options: itemData.id,
      };
    }
  }
}
