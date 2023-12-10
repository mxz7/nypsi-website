import type Game from "$lib/types/Game.js";

export const config = {
  runtime: "edge",
  regions: "all",
};

export async function load({ fetch, url }) {
  const loadedDate = Date.now();
  if (!url.searchParams.get("before")) url.searchParams.set("before", loadedDate.toString());
  if (!url.searchParams.get("take")) url.searchParams.set("take", "50");

  let resultText = "";

  if (url.searchParams.get("user")) {
    const username = await fetch(`/api/user/username/${url.searchParams.get("user")}`).then((r) =>
      r.json(),
    );

    if (username.username)
      resultText = `<a href="/user/${username.username}" class='text-accent'>${username.username}'s</a> `;

    if (url.searchParams.has("game")) resultText += `${url.searchParams.get("game")} `;
    resultText += "games ";
  } else if (url.searchParams.has("game")) {
    resultText = `${url.searchParams.get("game")} games`;
  }

  return {
    loadedDate,
    resultText,
    streamed: {
      recentGames: fetch(`/api/game?${url.searchParams.toString()}`).then(
        (r) => r.json() as Promise<{ ok: boolean; games: Game[] }>,
      ),
    },
  };
}
