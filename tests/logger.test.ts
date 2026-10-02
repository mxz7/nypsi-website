import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RequestEvent } from "@sveltejs/kit";

const { logger, environment } = vi.hoisted(() => ({
  environment: { building: false, dev: true },
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));
vi.mock("$app/env", () => environment);
vi.mock("$app/env/private", () => ({ LOKI_USERNAME: "", LOKI_PASSWORD: "", LOKI_HOST: "" }));
vi.mock("pino", () => ({ default: Object.assign(() => logger, { transport: vi.fn() }) }));

import { logRequest, logError } from "#lib/server/logger.js";

function event(url: string, remote = false): RequestEvent {
  return {
    request: new Request(url),
    isRemoteRequest: remote,
    getClientAddress: () => "127.0.0.1",
    get url() {
      throw new Error("Cannot read event.url inside a remote query");
    },
    locals: { startTimer: performance.now(), logger, authedUser: { id: "user-1" } },
  } as unknown as RequestEvent;
}

describe("request logging", () => {
  it("keeps HTTP request and error logging silent in development", () => {
    environment.dev = true;
    const request = event("https://nypsi.xyz/me");
    for (const status of [200, 404, 500]) logRequest(status, request);
    logError(500, "unknown", request);
    expect(logger.info).not.toHaveBeenCalled();
    expect(logger.warn).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    environment.dev = false;
  });

  it("logs production remote calls without serialized arguments", () => {
    logRequest(
      200,
      event("https://nypsi.xyz/_app/remote/hash/getAuthedUser?payload=private-value", true),
    );
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({
        event_type: "request",
        remote_function: "getAuthedUser",
        status: 200,
        path: "/_app/remote/hash/getAuthedUser",
        user_id: "user-1",
      }),
    );
    expect(JSON.stringify(logger.info.mock.calls)).not.toContain("private-value");
  });

  it("separates logical validation failures from successful HTTP responses", () => {
    const request = event(
      "https://nypsi.xyz/_app/remote/hash/saveGuildSettings?payload=private-value",
      true,
    );
    request.locals.error = "Bad Request";
    logError(400, "validation", request, 2);
    logRequest(200, request);
    expect(logger.warn).toHaveBeenCalledWith(
      expect.objectContaining({
        event_type: "error",
        status: 400,
        error_kind: "validation",
        validation_issue_count: 2,
      }),
    );
    expect(logger.info.mock.calls[0][0]).toMatchObject({ event_type: "request", status: 200 });
    expect(logger.info.mock.calls[0][0]).not.toHaveProperty("error");
    expect(JSON.stringify(logger.warn.mock.calls)).not.toContain("private-value");
  });

  it("identifies unenhanced forms without logging their query parameters", () => {
    logRequest(303, event("https://nypsi.xyz/me?/remote=hash/logOut&private=value"));
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({ remote_function: "logOut", path: "/me" }),
    );
  });

  it("logs stream failures after the connection access log", () => {
    const request = event("https://nypsi.xyz/_app/remote/hash/getClicks", true);
    logRequest(200, request);
    Object.assign(request.locals, {
      error: "Connection failed",
      errorId: "error-id",
      errorStackTrace: "stack",
    });
    logError(500, "unknown", request);
    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        event_type: "error",
        error_id: "error-id",
        error_stack_trace: "stack",
        remote_function: "getClicks",
      }),
    );
  });

  it("omits OAuth authorization codes from access logs", () => {
    logRequest(
      302,
      event("https://nypsi.xyz/login/callback?code=private-code&state=private-state"),
    );
    expect(logger.info.mock.calls[0][0].path).toBe("/login/callback");
    expect(JSON.stringify(logger.info.mock.calls)).not.toContain("private-code");
  });

  it("also omits OAuth callback codes from referrers", () => {
    const request = event("https://nypsi.xyz/me");
    request.request = new Request("https://nypsi.xyz/me", {
      headers: {
        referer: "https://nypsi.xyz/login/callback?code=private-code&state=private-state",
      },
    });
    logRequest(200, request);
    expect(logger.info.mock.calls[0][0].referer).toBe("/login/callback");
    expect(JSON.stringify(logger.info.mock.calls)).not.toContain("private-code");
  });

  it("handles errors before request locals are initialized", () => {
    const request = event("https://nypsi.xyz/missing");
    request.locals = {} as App.Locals;
    logError(404, "framework", request);
    expect(logger.warn).toHaveBeenCalledWith(
      expect.objectContaining({ status: 404, elapsed: undefined }),
    );
  });
});
