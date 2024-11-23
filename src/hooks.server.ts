import { log } from "$lib/server/logger";
import { redirect } from "@sveltejs/kit";

export function handleError({ event, error, message, status }) {
  const errorId = crypto.randomUUID();
  event.locals.error = error?.toString() || undefined;
  event.locals.errorStackTrace = (error as Error)?.stack || undefined;
  event.locals.errorId = errorId;

  log(status, event);

  return { message: message || "an unexpected error occured", errorId: errorId };
}

export async function handle({ event, resolve }) {
  event.locals.startTimer = performance.now();

  if (event.url.hostname !== "nypsi.xyz")
    return redirect(303, `https://nypsi.xyz${event.url.pathname}`);

  // if (!dev && !event.isSubRequest && event.url.pathname.startsWith("/api")) {
  //  const rateLimitAttempt = await rateLimiter.limit(event.getClientAddress()).catch(() => {
  //    return { success: true, reset: 69 };
  //  });

  //   if (!rateLimitAttempt.success) {
  //     const timeRemaining = Math.floor((rateLimitAttempt.reset - new Date().getTime()) / 1000);

  //     return error(429, `too many requests. please try again in ${timeRemaining} seconds.`);
  //   }
  // }
  //    log(429, event);
  //    return error(429, `too many requests. please try again in ${timeRemaining} seconds.`);
  //  }
  //}

  event.locals.validate = async () => {
    if (event.cookies.getAll().length === 0) return null;
    if (event.request.headers.get("user-agent")?.toLowerCase().includes("bot")) return null;
    const res = await event.fetch("/api/auth").then((r) => r.json());
    const { user, session } = res;

    if (!user || !session) return null;

    return { user, session };
  };

  const res = await resolve(event);

  if (!res.headers.get("cache-control")) {
    res.headers.set("cache-control", "no-cache");
  }

  log(res.status, event);

  return res;
}
