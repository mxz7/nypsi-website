import { dev } from "$app/environment";
import rateLimiter from "$lib/server/ratelimit";
import { error } from "@sveltejs/kit";

export const handle = async ({ event, resolve }) => {
  if (!dev && (event.isDataRequest || event.url.pathname.startsWith("/api"))) {
    const rateLimitAttempt = await rateLimiter.limit(event.getClientAddress()).catch(() => {
      return { success: true, reset: 69 };
    });

    if (!rateLimitAttempt.success) {
      const timeRemaining = Math.floor((rateLimitAttempt.reset - new Date().getTime()) / 1000);
      return error(429, { message: `too many requests. try again in ${timeRemaining} seconds` });
    }
  }

  event.locals.validate = async () => {
    const res = await event.fetch("/api/auth").then((r) => r.json());
    const { user, session } = res;

    if (!user || !session) return null;

    return { user, session };
  };

  const res = await resolve(event);

  if (res.redirected && res.headers.get("cache-control")) res.headers.delete("cache-control");

  return res;
};
