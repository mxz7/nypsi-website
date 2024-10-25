import type Game from "$lib/types/Game.js";

export const load = async ({ fetch, params, setHeaders }) => {
  setHeaders({ "cache-control": "public, max-age=600, must-revalidate" });
  return {
    game: (await fetch(`/api/game?id=${params.id.toLowerCase()}`).then((r) =>
      r.json().then((r) => r.games[0]),
    )) as Game,
  };
};
