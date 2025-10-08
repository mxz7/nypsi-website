import type { Game } from "$lib/types/Game";

export const load = async ({ fetch, params }) => {
  return {
    game: (await fetch(`/api/games?id=${params.id.toLowerCase()}`).then((r) =>
      r.json().then((r) => r.games[0]),
    )) as Game,
  };
};
