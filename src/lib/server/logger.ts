import { building, dev } from "$app/env";
import { LOKI_USERNAME, LOKI_PASSWORD, LOKI_HOST } from "$app/env/private";
import type { RequestEvent } from "@sveltejs/kit";
import pino from "pino";
import type { LokiOptions } from "pino-loki";

function buildTransport() {
  if (dev || building) {
    return undefined;
  }

  if (!LOKI_USERNAME || !LOKI_PASSWORD || !LOKI_HOST) {
    console.log("missing loki credentials, skipping loki transport");
    return undefined;
  }

  console.log("using loki transport");

  return pino.transport<LokiOptions>({
    target: "pino-loki",
    options: {
      host: LOKI_HOST,
      basicAuth: { username: LOKI_USERNAME, password: LOKI_PASSWORD },
      labels: { service_name: "nypsi-website" },
      headers: { "X-Scope-OrgID": "nypsi" },
    },
  });
}

export const baseLogger = pino({ base: undefined }, buildTransport());

function requestContext(event: RequestEvent) {
  // event.url cannot be read inside remote queries.
  const url = new URL(event.request.url);
  const remoteAction = url.searchParams.get("/remote");
  const remoteId = event.isRemoteRequest ? url.pathname.split("/remote/")[1] : remoteAction;
  const remote = event.isRemoteRequest || remoteAction !== null;
  let referer: string | undefined;

  try {
    const value = event.request.headers.get("referer");
    if (value) {
      const referrerUrl = new URL(value);
      if (
        referrerUrl.pathname === "/login/callback" ||
        referrerUrl.pathname.includes("/remote/") ||
        referrerUrl.searchParams.has("/remote")
      ) {
        referrerUrl.search = "";
      }
      referer =
        referrerUrl.hostname === "nypsi.xyz"
          ? referrerUrl.pathname + referrerUrl.search
          : referrerUrl.href;
    }
  } catch {}

  let address: string | undefined;
  try {
    address = event.getClientAddress();
  } catch {}

  return {
    method: event.request.method,
    // Remote URLs contain serialized arguments; OAuth callbacks contain authorization codes.
    path: remote || url.pathname === "/login/callback" ? url.pathname : url.pathname + url.search,
    remote_function: remoteId?.split("/")[1] || undefined,
    elapsed:
      event.locals.startTimer === undefined
        ? undefined
        : performance.now() - event.locals.startTimer,
    ip_address: address,
    user_agent: event.request.headers.get("user-agent") || "",
    referer,
    user_id: event.locals.authedUser?.id,
  };
}

export function logRequest(statusCode: number, event: RequestEvent) {
  if (dev || building) return;

  const logData = { ...requestContext(event), event_type: "request", status: statusCode };
  const logger = event.locals.logger || baseLogger;
  if (statusCode >= 500) logger.error(logData);
  else if (statusCode >= 400) logger.warn(logData);
  else logger.info(logData);
}

export function logError(
  statusCode: number,
  kind: "app" | "framework" | "validation" | "unknown",
  event: RequestEvent,
  validationIssueCount?: number,
) {
  if (dev || building) return;

  const logData = {
    ...requestContext(event),
    event_type: "error",
    status: statusCode,
    error_kind: kind,
    error: event.locals.error,
    error_id: event.locals.errorId,
    error_stack_trace: event.locals.errorStackTrace,
    validation_issue_count: validationIssueCount,
  };
  const logger = event.locals.logger || baseLogger;
  if (statusCode >= 500) logger.error(logData);
  else logger.warn(logData);
}
