import type Game from "$lib/types/Game.js";

export const config = {
  runtime: "edge",
  regions: "all",
};

export const load = async ({ fetch, params }) => {
  return {
    streamed: {
      game: fetch(`/api/game?id=${params.id.toLowerCase()}`).then((r) =>
        r.json().then((r) => r.games[0]),
      ) as Promise<Game>,
    },
  };
};
