import type { Game } from "$lib/types/Game";
import dayjs from "dayjs";

export async function load({ fetch, url }) {
  const loadedDate = dayjs()
    .set("minute", 0)
    .set("seconds", 0)
    .set("milliseconds", 0)
    .toDate()
    .getTime();

  if (!url.searchParams.get("before")) url.searchParams.set("before", loadedDate.toString());
  if (!url.searchParams.get("take")) url.searchParams.set("take", "48");

  let resultText = "";

  if (url.searchParams.get("user")) {
    const username = await fetch(`/api/users/username/${url.searchParams.get("user")}`).then((r) =>
      r.json(),
    );

    if (username.username)
      resultText = `<a href="/users/${username.username}" class='text-primary'>${username.username}'s</a> `;

    if (url.searchParams.has("game")) resultText += `${url.searchParams.get("game")} `;
    resultText += "games ";
  } else if (url.searchParams.has("game")) {
    resultText = `${url.searchParams.get("game")} games`;
  }

  return {
    loadedDate,
    resultText,

    recentGames: await fetch(`/api/games?${url.searchParams.toString()}`).then(
      (r) => r.json() as Promise<{ ok: boolean; games: Game[] }>,
    ),
  };
}
