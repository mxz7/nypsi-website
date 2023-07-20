import getItems from "$lib/functions/getItems.js";
import type { UserApiResponse } from "$lib/types/User.js";
import { redirect } from "@sveltejs/kit";

export async function load({ parent, url, fetch }) {
  const [{ user }, items] = await Promise.all([parent(), getItems()]);

  if (!user.authenticated)
    throw redirect(302, "/login?redirect=" + encodeURIComponent(url.toString()));

  return {
    items,
    streamed: {
      userData: fetch(`/api/user/${user.id}`).then((r) => r.json() as Promise<UserApiResponse>),
    },
  };
}
