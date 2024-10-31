import { redirect } from "@sveltejs/kit";

export async function load({ setHeaders, locals, url }) {
  const auth = await locals.validate();

  if (!auth) return redirect(302, "/login?next=" + encodeURIComponent(url.pathname));

  setHeaders({
    "cache-control": "private, max-age=0",
  });

  return { user: auth.user };
}
