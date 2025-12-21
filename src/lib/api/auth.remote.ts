import { getRequestEvent, query } from "$app/server";
import { getSessionCookie, validateSession } from "$lib/server/auth/sessions";

export const getAuthedUser = query(async () => {
  const { cookies, locals } = getRequestEvent();

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

  // @ts-expect-error shhh temporary until i change everything to remote functions
  locals.auth = validated;

  return validated.user;
});
