import getGuildData from "$lib/server/functions/graphs/getGuildData.js";
import { error, json } from "@sveltejs/kit";

export async function GET({ params, setHeaders }) {
  setHeaders({ "cache-control": "public, max-age=3600" });

  if (!["balance", "xp", "level"].includes(params.graphData))
    return error(404, "invalid graph data");

  return json({
    data: await getGuildData(params.name, params.graphData as "balance" | "xp" | "level"),
  });
}

export type APIGuildGraphData = {
  data: ReturnType<typeof getGuildData>;
};
