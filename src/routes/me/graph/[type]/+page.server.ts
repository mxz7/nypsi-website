import getItems from "$lib/functions/getItems.js";
import getGraphData from "$lib/server/functions/getGraphData.js";
import type { Item } from "$lib/types/Item.js";
import { redirect } from "@sveltejs/kit";

export const load = async ({ parent, setHeaders, params }) => {
  const [parentData, items] = await Promise.all([parent(), getItems()]);

  if (!parentData.premium || !parentData.user.authenticated) return;

  setHeaders({ "cache-control": "max-age=600" });

  let category = "";
  let title = "";
  let item: Item;

  if (params.type === "money") {
    title = "balance history";
    category = "user-money";
  } else if (params.type === "karma") {
    title = "karma history";
    category = "user-karma";
  } else if (params.type === "networth") {
    title = "networth history";
    category = "user-net";
  } else {
    if (!items.find((i) => i.id === params.type)) throw redirect(303, "/me");
    item = items.find((i) => i.id === params.type);

    title = `${item.name} history`;
    category = "user-item-" + item.id;
  }

  return {
    base: 69,
    title,
    streamed: { graphData: getGraphData(category, parentData.user.id) },
  };
};
