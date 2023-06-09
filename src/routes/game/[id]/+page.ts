import type Game from "$lib/types/Game.js";

export const load = async ({ fetch, params }) => {
  return {
    streamed: { game: fetch(`/api/game/${params.id}`).then((r) => r.json()) as Promise<Game> },
  };
};
