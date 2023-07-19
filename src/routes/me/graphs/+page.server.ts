import getItems from "$lib/functions/getItems.js";
import getGraphData from "$lib/server/functions/getGraphData.js";
import { redirect } from "@sveltejs/kit";

export const ssr = false;

export async function load({ setHeaders, parent, url }) {
  const [parentData, items] = await Promise.all([parent(), getItems()]);

  if (!parentData.user.authenticated || !(await Promise.resolve(parentData.streamed.premium)))
    throw redirect(303, "/me");

  setHeaders({
    "cache-control": "max-age=3600",
  });

  if (url.searchParams.get("items")) {
    // boobies xd
  } else {
    return {
      streamed: {
        balance: getGraphData(["user-money"], parentData.user.id, items),
        networth: getGraphData(["user-net"], parentData.user.id, items),
        karma: getGraphData(["user-karma"], parentData.user.id, items),
      },
    };
  }
}
