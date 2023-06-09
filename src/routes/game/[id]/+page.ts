import type Game from "$lib/types/Game.js";

export const load = async ({ fetch, params }) => {
  return {
    streamed: {
      game: fetch(`/api/game/${params.id.toLowerCase()}`).then((r) => r.json()) as Promise<Game>,
    },
  };
};
