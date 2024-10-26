import getItems from "$lib/functions/items.js";
import type { BaseUserData, UserApiResponsexd } from "$lib/types/User.js";
import { redirect } from "@sveltejs/kit";

export async function load({ url, fetch, locals }) {
  const auth = await locals.validate();

  if (!auth) redirect(302, "/login?next=" + encodeURIComponent(url.pathname));

  const [items, baseData] = await Promise.all([
    getItems(),
    fetch(`/api/user/${auth.user.id}/base`).then((r) => r.json() as Promise<BaseUserData>),
  ]);

  console.log(baseData);
  return {
    items,
    baseData,
    user: auth.user,
    userData: fetch(`/api/user/${auth.user.id}`).then(
      (r) => r.json() as Promise<UserApiResponsexd>,
    ),
  };
}
