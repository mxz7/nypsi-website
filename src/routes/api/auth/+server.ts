import { lucia } from "$lib/server/functions/auth.js";
import redis from "$lib/server/redis.js";
import { json } from "@sveltejs/kit";
import type { Session, User } from "lucia";

export async function GET({ cookies, setHeaders }) {
  setHeaders({ "cache-control": "public, max-age=0, must-revalidate" });

  const sessionId = cookies.get(lucia.sessionCookieName);
  if (!sessionId) {
    return json({ authenticated: false });
  }

  let session: Session;
  let user: User;

  const cache = await redis.get(`cache:session:${sessionId}`);

  if (cache) {
    session = JSON.parse(cache)?.session;
    user = JSON.parse(cache)?.user;
  } else {
    const authData = await lucia.validateSession(sessionId);

    session = authData?.session;
    user = authData?.user;

    if (session)
      await redis.set(
        `cache:session:${sessionId}`,
        JSON.stringify(authData),
        "PXAT",
        session.expiresAt.getTime(),
      );
  }

  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    // sveltekit types deviates from the de-facto standard
    // you can use 'as any' too
    cookies.set(sessionCookie.name, sessionCookie.value, {
      path: ".",
      ...sessionCookie.attributes,
    });
  } else if (!session) {
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
