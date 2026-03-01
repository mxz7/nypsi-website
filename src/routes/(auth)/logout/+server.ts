import { deleteSessionCookie, invalidateSession } from "$lib/server/auth/sessions.js";
import { redirect } from "@sveltejs/kit";

export const GET = async ({ locals, url, cookies }) => {
  const auth = await locals.validate();

  if (!auth?.session) return redirect(302, "/");
  await invalidateSession(auth.session.id);
  deleteSessionCookie(cookies);

  const next = url.searchParams.get("next");

  if (next) return redirect(302, next);

  return redirect(302, "/");
};
