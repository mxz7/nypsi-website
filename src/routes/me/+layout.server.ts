import getItems from "$lib/functions/getItems.js";
import type { BaseUserData, UserApiResponsexd } from "$lib/types/User.js";
import { redirect } from "@sveltejs/kit";
import type { User } from "lucia";

export async function load({ parent, url, fetch }) {
  let { user } = await parent();

  user = await user;

  console.log(user);

  if (!user) redirect(302, "/login?next=" + encodeURIComponent(url.pathname));

  const [items, baseData] = await Promise.all([
    getItems(),
    fetch(`/api/user/${user.id}/base`).then((r) => r.json() as Promise<BaseUserData>),
  ]);

  console.log(baseData);
  return {
    items,
    baseData,
    user: user as User,
    userData: fetch(`/api/user/${user.id}`).then((r) => r.json() as Promise<UserApiResponsexd>),
  };
}
