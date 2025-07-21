import { building, dev } from "$app/environment";
import type { RequestEvent } from "@sveltejs/kit";
import pino from "pino";

const logger = pino(
  {
    base: null,
  },
  dev || building
    ? undefined
    : pino.transport({
        target: "pino/file",
        options: { destination: "/var/log/nypsi-website/nypsi-website.log" },
      }),
);

export function log(
  statusCode: number,
  event: RequestEvent<Partial<Record<string, string>>, string>,
) {
  if (building) return;

  const error = event.locals?.error || undefined;
  const errorId = event.locals?.errorId || undefined;
  const errorStackTrace = event.locals?.errorStackTrace || undefined;

  let referer: string | undefined;

  if (event.request.headers.has("referer")) {
    try {
      referer = event.request.headers.get("referer");
      if (new URL(referer)?.hostname === "nypsi.xyz") {
        referer = `/${referer.split("/").slice(3).join("/")}`;
      }
    } catch (e) {
      console.error(e);
      console.error("failed to process referrer: " + referer);
    }
  }

  let address: string | undefined;

  try {
    address = event.getClientAddress();
  } catch {}

  const logData = {
    method: event.request.method,
    status: statusCode,
    path: event.url.pathname,
    referer,
    ip_address: address,
    user_agent: event.request.headers.get("user-agent") || "",
    elapsed: performance.now() - event.locals.startTimer,
    params:
      event.url.searchParams.size > 0
        ? { ...Object.fromEntries(event.url.searchParams.entries()) }
        : undefined,
    error,
    errorId,
    errorStackTrace,
  };

  if (dev) return;

  if (statusCode >= 400) logger.error(logData);
  else logger.info(logData);
}
