import { dev } from "$app/env";
import { baseLogger, logRequest } from "#lib/server/logger.js";

// selectively preload fonts
const fonts = ["inter-latin-wght-normal"];

export function handleError({ event, error, kind }) {
  if (kind === "unknown") {
    if (dev) console.error(error);
    event.locals.error = String(error);
    event.locals.errorStackTrace = error instanceof Error ? error.stack : undefined;
  } else {
    event.locals.error = error.message;
  }

  // Keep SvelteKit's safe message/status and app properties such as reconnectUrl.
  // The handle hook logs the final response, avoiding duplicate request logs here.
  return { requestId: event.locals.logger?.bindings().requestId };
}

export async function handle({ event, resolve }) {
  event.locals.startTimer = performance.now();
  event.locals.logger = baseLogger.child({ requestId: crypto.randomUUID() });

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

  if (!dev && res.headers.get("content-type")?.includes("text/html")) {
    res.headers.set("content-security-policy", "frame-ancestors 'self' https://analytics.maxz.dev");
  }

  logRequest(res.status, event);

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
