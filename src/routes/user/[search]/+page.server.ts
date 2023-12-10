import { VIEW_AUTH } from "$env/static/private";
import getItems from "$lib/functions/getItems.js";
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

  if (!search) throw redirect(302, "/user/unknown");

  if (search.match(/^\d{17,19}$/)) {
    userId = search;

    const res = await fetch(`/api/user/check/${userId}`).then((r) => r.json());

    if (!res.exists) throw redirect(302, `/user/unknown?user=${search}`);
    if (res.private) throw redirect(302, "/user/private");
  } else {
    const res = await fetch(`/api/user/getid/${search}`).then((r) => r.json());

    if (res.id) {
      userId = res.id;
    } else {
      throw redirect(302, `/user/unknown?user=${search}`);
    }
  }

  return {
    baseUserData: fetch(`/api/user/${userId}/base`).then((r) => r.json() as Promise<BaseUserData>),
    items: getItems(),
    streamed: {
      tagData: fetch("https://raw.githubusercontent.com/tekoh/nypsi/main/data/tags.json")
        .then((r) => r.text())
        .then((r) => JSON.parse(r)),
      allUserData: fetch(`/api/user/${userId}`).then((r) => r.json()),
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
    },
  };
};
