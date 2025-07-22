import { dev } from "$app/environment";
import { log } from "$lib/server/logger";

export function handleError({ event, error, message, status }) {
  if (dev) return console.error(error);
  const errorId = crypto.randomUUID();
  event.locals.error = error?.toString() || undefined;
  event.locals.errorStackTrace = (error as Error)?.stack || undefined;
  event.locals.errorId = errorId;

  log(status, event);

  return { message: message || "an unexpected error occured", errorId: errorId };
}

export async function handle({ event, resolve }) {
  event.locals.startTimer = performance.now();

  event.locals.validate = async () => {
    if (event.locals.auth) return event.locals.auth;
    if (event.cookies.getAll().length === 0) return null;
    if (event.request.headers.get("user-agent")?.toLowerCase().includes("bot")) return null;
    const res = await event.fetch("/api/auth").then((r) => r.json());
    const { user, session } = res;

    if (!user || !session) return null;

    event.locals.auth = { user, session };

    return { user, session };
  };

  const res = await resolve(event);

  if (!res.headers.get("cache-control")) {
    res.headers.set("cache-control", "no-cache");
  }

  log(res.status, event);

  return res;
}

export async function init() {
  process.on("unhandledRejection", (e) => {
    console.error(e);
  });

  process.on("uncaughtException", (e) => {
    console.error(e);
  });
}
