import { building, dev } from "$app/environment";
import { env } from "$env/dynamic/private";
import type { RequestEvent } from "@sveltejs/kit";
import pino from "pino";
import type { LokiOptions } from "pino-loki";

function buildTransport() {
  if (dev || building) {
    return undefined;
  }

  if (!env.LOKI_USERNAME || !env.LOKI_PASSWORD || !env.LOKI_HOST) {
    console.log("missing loki credentials, skipping loki transport");
    return undefined;
  }

  console.log("using loki transport");

  return pino.transport<LokiOptions>({
    target: "pino-loki",
    options: {
      host: env.LOKI_HOST,
      basicAuth: {
        username: env.LOKI_USERNAME,
        password: env.LOKI_PASSWORD,
      },
      labels: { service_name: "nypsi-website" },
      headers: { "X-Scope-OrgID": "nypsi" },
    },
  });
}

const logger = pino({ base: undefined }, buildTransport());

export function log(statusCode: number, event: RequestEvent<Partial<Record<string, string>>>) {
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

  const logData: Record<string, any> = {
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
    error_id: errorId,
    error_stack_trace: errorStackTrace,
  };

  if (event.locals.auth) {
    logData.user_id = event.locals.auth.user.id;
  }

  if (dev) return;

  if (statusCode >= 500) {
    logger.error(logData);
  } else if (statusCode >= 400) {
    logger.warn(logData);
  } else {
    logger.info(logData);
  }
}
