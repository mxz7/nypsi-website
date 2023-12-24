import { VIEW_AUTH } from "$env/static/private";
import getItems from "$lib/functions/getItems.js";
import type Game from "$lib/types/Game.js";
import type { BaseUserData } from "$lib/types/User.js";
import { redirect } from "@sveltejs/kit";

export const config = {
  runtime: "edge",
  regions: "all",
};

export const load = async ({ params, fetch, setHeaders, parent, getClientAddress, request }) => {
  setHeaders({
    "cache-control": "max-age=300",
  });

  const search = params.search;
  let userId: string;

  if (!search) redirect(302, "/user/unknown");

  if (search.match(/^\d{17,19}$/)) {
    userId = search;

    const res = await fetch(`/api/user/check/${userId}`).then((r) => r.json());

    if (!res.exists) return redirect(302, `/user/unknown?user=${search}`);
    if (res.private) return redirect(302, "/user/private");
  } else {
    const res = await fetch(`/api/user/getid/${search}`).then((r) => r.json());

    if (res.id) {
      userId = res.id;
    } else {
      return redirect(302, `/user/unknown?user=${search}`);
    }
  }

  const [baseUserData, items] = await Promise.all([
    fetch(`/api/user/${userId}/base`).then((r) => r.json() as Promise<BaseUserData>),
    getItems(),
  ]);

  const before = Date.now();

  return {
    baseUserData,
    items,
    allUserData: fetch(`/api/user/${userId}`).then((r) => r.json()),
    games: fetch(`/api/game?user=${userId}&before=${before}`).then((r) => r.json()) as Promise<{
      ok: boolean;
      games: Game[];
    }>,
    gamesBefore: before,
    _view: (async () => {
      if (request.headers.get("user-agent").includes("bot")) return;
      const parentData = await parent();

      if (parentData.user.authenticated) {
        if (parentData.user.id === userId) return;
      }

      let ip: string;

      try {
        ip = getClientAddress();
      } catch {
        ip = "127.0.0.1";
      }

      return fetch("/api/user/view/add", {
        method: "POST",
        headers: { Authorization: VIEW_AUTH },
        body: JSON.stringify({
          userId,
          viewerId: parentData.user.authenticated ? parentData.user.id : undefined,
          viewerIp: ip,
          referrer: request.headers.get("referer"),
        }),
      })
        .then((r) => r.json().catch(() => null))
        .catch(() => null);
    })(),
  };
};
