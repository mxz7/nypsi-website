import getItems from "$lib/functions/getItems.js";
import getItemHistoryData from "$lib/server/functions/graphs/getItemHistoryData.js";

export const ssr = false;

export const load = async ({ params, parent, setHeaders, url }) => {
  const parentData = await parent();

  if (!parentData.premium || !parentData.user.authenticated) return;

  setHeaders({ "cache-control": "s-maxage=600" });

  const item = await getItems().then((items) => items.find((i) => i.id === params.item));

  if (!item) return { item: undefined, streamed: { graphData: "invalid item" } };

  const days = parseInt(url.searchParams.get("days")) || 30;

  return {
    base: 69,
    item,
    graphData: await getItemHistoryData(params.item, parentData.user.id, days),
  };
};
