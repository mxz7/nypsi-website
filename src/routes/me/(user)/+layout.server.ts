import { getAuthedUser } from "$lib/api/auth.remote";
import { redirect } from "@sveltejs/kit";

export async function load({ locals, url }) {
  const authedUser = await getAuthedUser();

  if (!authedUser) return redirect(302, "/login?next=" + encodeURIComponent(url.pathname));

  return { user: authedUser };
}
