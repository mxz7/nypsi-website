import { dev } from "$app/environment";
import { lucia } from "$lib/server/functions/auth";
import rateLimiter from "$lib/server/ratelimit";

export const handle = async ({ event, resolve }) => {
  if (!dev && !event.isSubRequest && event.url.pathname.startsWith("/api")) {
    const rateLimitAttempt = await rateLimiter.limit(event.getClientAddress()).catch(() => {
      return { success: true, reset: 69 };
    });

    if (!rateLimitAttempt.success) {
      const timeRemaining = Math.floor((rateLimitAttempt.reset - new Date().getTime()) / 1000);
      return new Response(
        JSON.stringify({
          message: `Too many requests. Please try again in ${timeRemaining} seconds.`,
          error: 429,
          status: 429,
        }),
        {
          status: 429,
        },
      );
    }
  }

  event.locals.validate = async () => {
    const sessionId = event.cookies.get(lucia.sessionCookieName);
    if (!sessionId) {
      return null;
    }

    const res = await event.fetch("/api/auth").then((r) => r.json());
    const { user, session } = res;

    if (!user || !session) return null;

    return { user, session };
  };

  const res = await resolve(event);

  if (res.redirected && res.headers.get("cache-control")) res.headers.delete("cache-control");

  return res;
};
