import { dev } from "$app/env";
import type { HandleServerError } from "@sveltejs/kit/hooks";
import { baseLogger, logError, logRequest } from "#lib/server/logger.js";

// selectively preload fonts
const fonts = ["inter-latin-wght-normal"];

export const handleError: HandleServerError = ({ event, error, kind, issues }) => {
  const requestId = event.locals.logger?.bindings().requestId;
  if (kind !== "unknown") {
    event.locals.error = error.message;
    event.locals.errorId = kind === "app" ? error.errorId : undefined;
    event.locals.errorStackTrace = undefined;
    logError(error.status, kind, event, kind === "validation" ? issues.length : undefined);
    return { ...error, requestId };
  }

  const errorId = crypto.randomUUID();
  event.locals.error = String(error);
  event.locals.errorId = errorId;
  event.locals.errorStackTrace = error instanceof Error ? error.stack : undefined;
  logError(500, kind, event);

  return { message: "An unexpected error occurred", errorId, requestId };
};

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
