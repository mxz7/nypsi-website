import getItems from "$lib/functions/getItems.js";
import getChartData from "$lib/server/functions/getChartData.js";
import { error } from "@sveltejs/kit";

export const load = async ({ params, parent, setHeaders }) => {
  const parentData = await parent();

  if (!parentData.premium || !parentData.user.authenticated) return;

  setHeaders({ "cache-control": "max-age=600" });

  const item = await getItems().then((items) => items.find((i) => i.id === params.item));

  if (!item) throw error(400, "invalid item");

  return { base: 69, item, streamed: { graphData: getChartData(params.item, parentData.user.id) } };
};
