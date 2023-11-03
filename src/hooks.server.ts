import { dev } from "$app/environment";
import rateLimiter from "$lib/server/ratelimit";

export const handle = async ({ event, resolve }) => {
  if (!dev && event.url.pathname.startsWith("/api")) {
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

  const res = await resolve(event);

  if (res.redirected && res.headers.get("cache-control")) res.headers.delete("cache-control");

  return res;
};
