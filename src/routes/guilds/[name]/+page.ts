import type { ApiGuildResponse } from "#lib/types/Guild.js";
import type { APIGuildGraphData } from "../../api/guilds/[name]/[graphData]/+server.js";

export const load = async ({ params, fetch, setHeaders }) => {
  setHeaders({ "x-accel-buffering": "no" });

  const guild = fetch(`/api/guilds/${params.name.replaceAll("-", " ")}`).then(
    (r) => r.json() as unknown as ApiGuildResponse,
  );

  return {
    guild: await guild,
    graphs: {
      balance: fetch(`/api/guilds/${params.name.replaceAll("-", " ")}/balance?v=2`).then(
        (r) => r.json() as Promise<APIGuildGraphData>,
      ),
      xp: fetch(`/api/guilds/${params.name.replaceAll("-", " ")}/xp?v=2`).then(
        (r) => r.json() as Promise<APIGuildGraphData>,
      ),
      level: fetch(`/api/guilds/${params.name.replaceAll("-", " ")}/level?v=2`).then(
        (r) => r.json() as Promise<APIGuildGraphData>,
      ),
    },
  };
};
