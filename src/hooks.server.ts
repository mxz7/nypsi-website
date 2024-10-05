import { dev } from "$app/environment";
import rateLimiter from "$lib/server/ratelimit";
import { error, redirect } from "@sveltejs/kit";

export const handle = async ({ event, resolve }) => {
  console.log(event.url);
  if (event.url.hostname === "nypsi-website.fly.dev")
    return redirect(403, `https://fly.nypsi.xyz${event.url.pathname}`);

  if (!dev && !event.isSubRequest && event.url.pathname.startsWith("/api")) {
    const rateLimitAttempt = await rateLimiter.limit(event.getClientAddress()).catch(() => {
      return { success: true, reset: 69 };
    });

    if (!rateLimitAttempt.success) {
      const timeRemaining = Math.floor((rateLimitAttempt.reset - new Date().getTime()) / 1000);

      return error(429, `too many requests. please try again in ${timeRemaining} seconds.`);
    }
  }

  event.locals.validate = async () => {
    if (event.cookies.getAll().length === 0) return null;
    if (event.request.headers.get("user-agent")?.toLowerCase().includes("bot")) return null;
    const res = await event.fetch("/api/auth").then((r) => r.json());
    const { user, session } = res;

    if (!user || !session) return null;

    return { user, session };
  };

  const res = await resolve(event);

  return res;
};
