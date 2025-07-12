import type { ApiGuildResponse } from "$lib/types/Guild.js";
import type { APIGuildGraphData } from "../../api/guilds/[name]/[graphData]/+server.js";

export const load = async ({ params, fetch, setHeaders }) => {
  setHeaders({ "x-accel-buffering": "no" });

  const guild = fetch(`/api/guilds/${params.name.replaceAll("-", " ")}`).then(
    (r) => r.json() as unknown as ApiGuildResponse,
  );

  return {
    guild: await guild,
    graphs: {
      balance: fetch(`/api/guilds/${params.name.replaceAll("-", " ")}/balance`).then((r) =>
        r.json().then((r) => r.data as APIGuildGraphData),
      ),
      xp: fetch(`/api/guilds/${params.name.replaceAll("-", " ")}/xp`).then((r) =>
        r.json().then((r) => r.data as APIGuildGraphData),
      ),
      level: fetch(`/api/guilds/${params.name.replaceAll("-", " ")}/level`).then((r) =>
        r.json().then((r) => r.data as APIGuildGraphData),
      ),
    },
  };
};
