import { redirect } from "@sveltejs/kit";

export async function load({ locals, url }) {
  const auth = await locals.validate();

  if (!auth) return redirect(302, "/login?next=" + encodeURIComponent(url.pathname));

  return { user: auth.user };
}
