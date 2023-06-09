import { dev } from "$app/environment";
import rateLimiter from "$lib/server/ratelimit";

export const handle = async ({ event, resolve }) => {
  if (!dev && event.url.pathname.startsWith("/api")) {
    const rateLimitAttempt = await rateLimiter.limit(event.getClientAddress());

    if (!rateLimitAttempt.success) {
      const timeRemaining = Math.floor((rateLimitAttempt.reset - new Date().getTime()) / 1000);
      return new Response(
        JSON.stringify({
          error: `Too many requests. Please try again in ${timeRemaining} seconds.`,
        }),
        {
          status: 429,
        }
      );
    }
  }

  const response = await resolve(event);
  return response;
};
