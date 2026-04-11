import { dev } from "$app/environment";
import { log } from "$lib/server/logger";

// selectively preload fonts
const fonts = ["inter-latin-wght-normal"];

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

  const res = await resolve(event, {
    preload: ({ type, path }) => {
      if (type === "font") {
        return fonts.some((font) => path.includes(font));
      }

      return type === "js" || type === "css";
    },
  });

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
