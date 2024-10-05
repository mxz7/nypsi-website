import { lucia } from "$lib/server/functions/auth.js";
import { json } from "@sveltejs/kit";

export async function GET({ cookies, setHeaders }) {
  setHeaders({ "cache-control": "no-cache" });

  const sessionId = cookies.get(lucia.sessionCookieName);
  if (!sessionId) {
    return json({ authenticated: false });
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    // sveltekit types deviates from the de-facto standard
    // you can use 'as any' too
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });
  }
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });
  }

  if (!user || !session) {
    return json({ authenticated: false });
  }
  return json({ authenticated: true, user, session });
}
