import type { RequestEvent } from "@sveltejs/kit";
import pino from "pino";

const logger = pino({
  base: null,
});

export function log(
  statusCode: number,
  event: RequestEvent<Partial<Record<string, string>>, string>,
) {
  const error = event.locals?.error || undefined;
  const errorId = event.locals?.errorId || undefined;
  const errorStackTrace = event.locals?.errorStackTrace || undefined;

  let referer: string | undefined;

  if (event.request.headers.has("referer")) {
    referer = event.request.headers.get("referer");
    if (referer.startsWith("http://localhost:5173") || referer.startsWith("https://nypsi.xyz")) {
      referer = `/${referer.split("/").slice(3).join("/")}`;
    }
  }

  const logData = {
    method: event.request.method,
    status: statusCode,
    path: event.url.pathname,
    referer,
    ip_address: event.getClientAddress(),
    user_agent: event.request.headers.get("user-agent") || "",
    elapsed: performance.now() - event.locals.startTimer,
    error,
    errorId,
    errorStackTrace,
  };

  if (statusCode >= 400) logger.error(logData);
  else logger.info(logData);
}
