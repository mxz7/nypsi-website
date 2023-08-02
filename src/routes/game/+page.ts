import type Game from "$lib/types/Game.js";

export function load({ fetch, url }) {
  const loadedDate = Date.now();
  if (!url.searchParams.get("before")) url.searchParams.set("before", loadedDate.toString());
  if (!url.searchParams.get("take")) url.searchParams.set("take", "50");

  return {
    loadedDate,
    streamed: {
      recentGames: fetch(`/api/game?${url.searchParams.toString()}`).then(
        (r) => r.json() as Promise<{ ok: boolean; games: Game[] }>,
      ),
    },
  };
}
