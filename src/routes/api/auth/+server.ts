import { getSessionCookie, validateSession } from "$lib/server/auth/sessions";
import { json } from "@sveltejs/kit";

export async function GET({ cookies, setHeaders, locals }) {
  setHeaders({ "cache-control": "public, max-age=0, must-revalidate" });

  if (locals.auth) {
    return json({ authenticated: true, user: locals.auth.user });
  }

  const sessionId = getSessionCookie(cookies);

  if (!sessionId) {
    locals.auth = null;
    return json({ authenticated: false });
  }

  const validated = await validateSession(sessionId);

  if (!validated) {
    locals.auth = null;
    return json({ authenticated: false });
  }

  locals.auth = validated;

  return json({ authenticated: true, ...locals.auth });
}
