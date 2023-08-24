import { dev } from "$app/environment";
import rateLimiter from "$lib/server/ratelimit";
import * as Sentry from "@sentry/sveltekit";
import { sequence } from "@sveltejs/kit/hooks";

Sentry.init({
    dsn: "https://a73111e3e265cbe1bf97fa484c0e1a0e@o4505075574898688.ingest.sentry.io/4505760518832128",
    tracesSampleRate: 1
})

export const handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
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

  return await resolve(event);
});
export const handleError = Sentry.handleErrorWithSentry();