import { form, getRequestEvent, query } from "$app/server";
import { getSessionCookie, invalidateSession, validateSession } from "$lib/server/auth/sessions";
import { redirect } from "@sveltejs/kit";

export const getAuthedUser = query(async () => {
  const { cookies, locals } = getRequestEvent();

  if (locals.auth) {
    return locals.auth.user;
  }

  const sessionId = getSessionCookie(cookies);

  if (!sessionId) {
    locals.auth = null;
    return null;
  }

  const validated = await validateSession(sessionId);

  if (!validated) {
    locals.auth = null;
    return null;
  }

  locals.auth = validated;

  return validated.user;
});

export const logOut = form(async () => {
  const { cookies, locals } = getRequestEvent();

  const authedUser = await getAuthedUser();

  console.log(authedUser, locals);

  if (!authedUser && !locals.auth?.session) {
    return;
  }

  await invalidateSession(locals.auth.session.id);
  cookies.delete("session", { path: "/" });

  redirect(302, "/");
});
