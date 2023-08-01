import type Game from "$lib/types/Game.js";

export function load({ fetch }) {
  const loadedDate = Date.now();
  return {
    base: 69,
    loadedDate,
    streamed: {
      recentGames: fetch(`/api/game?before=${loadedDate}&take=50`).then(
        (r) => r.json() as Promise<{ ok: boolean; games: Game[] }>,
      ),
    },
  };
}
