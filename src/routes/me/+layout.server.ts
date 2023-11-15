import getItems from "$lib/functions/getItems.js";
import type { BaseUserData, UserApiResponsexd } from "$lib/types/User.js";
import { redirect } from "@sveltejs/kit";

export async function load({ parent, url, fetch }) {
  const [{ user }, items] = await Promise.all([parent(), getItems()]);

  if (!user.authenticated) throw redirect(302, "/login?next=" + encodeURIComponent(url.pathname));

  return {
    items,
    baseData: fetch(`/api/user/${user.id}/base`).then((r) => r.json() as Promise<BaseUserData>),
    streamed: {
      userData: fetch(`/api/user/${user.id}`).then((r) => r.json() as Promise<UserApiResponsexd>),
    },
  };
}
