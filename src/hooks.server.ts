import { dev } from "$app/environment";
import rateLimiter from "$lib/server/ratelimit";

export const handle = async ({ event, resolve }) => {
  if (!dev && event.url.pathname.startsWith("/api")) {
    const rateLimitAttempt = await rateLimiter.limit(event.getClientAddress());

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
        }
      );
    }
  }

  return await resolve(event);
};
