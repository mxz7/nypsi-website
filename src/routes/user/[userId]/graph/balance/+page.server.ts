import getGraphData from "$lib/server/functions/getGraphData.js";
import { redirect } from "@sveltejs/kit";

export const load = async ({ params, parent, setHeaders }) => {
  const parentData = await parent();

  if (!parentData.premium || !parentData.user.authenticated) return;

  if (params.userId !== parentData.user.id) throw redirect(302, `/user/${parentData.user.id}/graph/balance`);

  setHeaders({ "cache-control": "max-age=600" });

  return { base: 69, streamed: { graphData: getGraphData("user-money", params.userId), userId: params.userId } };
};
