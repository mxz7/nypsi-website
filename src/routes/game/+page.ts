import type Game from "$lib/types/Game.js";
import dayjs from "dayjs";

export async function load({ fetch, url, setHeaders }) {
  setHeaders({ "cache-control": "public, max-age=600, must-revalidate" });

  const loadedDate = dayjs()
    .set("minute", 0)
    .set("seconds", 0)
    .set("milliseconds", 0)
    .toDate()
    .getTime();

  if (!url.searchParams.get("before")) url.searchParams.set("before", loadedDate.toString());
  if (!url.searchParams.get("take")) url.searchParams.set("take", "50");

  let resultText = "";

  if (url.searchParams.get("user")) {
    const username = await fetch(`/api/user/username/${url.searchParams.get("user")}`).then((r) =>
      r.json(),
    );

    if (username.username)
      resultText = `<a href="/user/${username.username}" class='text-primary'>${username.username}'s</a> `;

    if (url.searchParams.has("game")) resultText += `${url.searchParams.get("game")} `;
    resultText += "games ";
  } else if (url.searchParams.has("game")) {
    resultText = `${url.searchParams.get("game")} games`;
  }

  return {
    loadedDate,
    resultText,

    recentGames: await fetch(`/api/game?${url.searchParams.toString()}`).then(
      (r) => r.json() as Promise<{ ok: boolean; games: Game[] }>,
    ),
  };
}
