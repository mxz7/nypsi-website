import type Game from "$lib/types/Game.js";
import type { BaseUserData, UserApiResponsexd } from "$lib/types/User.js";
import { error } from "@sveltejs/kit";
import dayjs from "dayjs";

export async function load({ params, fetch, setHeaders, parent }) {
  const search = params.search;
  let userId: string;

  if (!search) return error(404, { message: "not found" });

  if (search.match(/^\d{17,19}$/)) {
    userId = search;
  } else {
    const res = await fetch(`/api/user/getid/${search}`).then((r) => r.json());

    if (res.id) {
      userId = res.id;
    } else if (res.message === "private profile") {
      if (res.private) return error(403, { message: "private profile" });
    } else {
      return error(404, { message: "unknown user" });
    }
  }

  const [baseUserDataResponse, { items }] = await Promise.all([
    fetch(`/api/user/${userId}/base`),
    parent(),
  ]);

  if (baseUserDataResponse.status !== 200) {
    const errorData = await baseUserDataResponse.json();

    return error(baseUserDataResponse.status, errorData.message);
  }

  const before = dayjs()
    .set("minutes", 0)
    .set("seconds", 0)
    .set("milliseconds", 0)
    .toDate()
    .getTime();

  return {
    baseUserData: (await baseUserDataResponse.json()) as BaseUserData,
    items,
    allUserData: fetch(`/api/user/${userId}`).then((r) => r.json() as Promise<UserApiResponsexd>),
    games: fetch(`/api/game?user=${userId}&before=${before}&take=20`).then((r) =>
      r.json(),
    ) as Promise<{
      ok: boolean;
      games: Game[];
    }>,
    gamesBefore: before,
    _view: fetch(`/api/user/${userId}/view`, { method: "post" }),
  };
}
