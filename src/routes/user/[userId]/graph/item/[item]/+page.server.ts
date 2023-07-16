import getItems from "$lib/functions/getItems.js";
import getGraphData from "$lib/server/functions/getGraphData.js";
import { redirect } from "@sveltejs/kit";

export const load = async ({ params, parent, setHeaders }) => {
  const parentData = await parent();

  if (!parentData.premium || !parentData.user.authenticated) return;

  if (params.userId !== parentData.user.id) throw redirect(302, `/user/${parentData.user.id}/graph/item/${params.item}`);

  setHeaders({ "cache-control": "max-age=600" });

  const item = await getItems().then((items) => items.find((i) => i.id === params.item));

  if (!item) return { item: undefined, streamed: { graphData: "invalid item", userId: params.userId } };

  return { base: 69, item, streamed: { graphData: getGraphData(`user-item-${params.item}`, params.userId, params.item), userId: params.userId } };
};
