import type { ApiGuildResponse } from "$lib/types/Guild.js";

export const load = async ({ params, fetch }) => {
  return {
    streamed: {
      data: fetch(`/api/guild/${params.name}`).then((r) => r.json() as unknown as ApiGuildResponse),
    },
  };
};
