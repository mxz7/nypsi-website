import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RequestEvent } from "@sveltejs/kit";

const { logError, logRequest, logger } = vi.hoisted(() => ({
  logError: vi.fn(),
  logRequest: vi.fn(),
  logger: { bindings: () => ({ requestId: "request-1" }) },
}));
vi.mock("$app/env", () => ({ dev: false }));
vi.mock("#lib/server/logger.js", () => ({ baseLogger: {}, logError, logRequest }));
import { handleError } from "../src/hooks.server";

function event() {
  return { locals: { logger } } as unknown as RequestEvent;
}

describe("error handling", () => {
  beforeEach(() => vi.clearAllMocks());

  it("preserves expected statuses and Discord reconnect links", () => {
    const request = event();
    const error = { status: 401, message: "reconnect", reconnectUrl: "/login?reauthorize=true" };
    expect(handleError({ kind: "app", error, event: request })).toEqual({
      ...error,
      requestId: "request-1",
    });
    expect(logError).toHaveBeenCalledWith(401, "app", request, undefined);
  });

  it("logs validation issue counts without their values", () => {
    const request = event();
    const error = { status: 400, message: "Bad Request" };
    const result = handleError({
      kind: "validation",
      error,
      event: request,
      issues: [{ message: "private-value" }],
    });
    expect(result).toEqual({ ...error, requestId: "request-1" });
    expect(logError).toHaveBeenCalledWith(400, "validation", request, 1);
    expect(request.locals.error).toBe("Bad Request");
  });

  it("keeps unexpected details in logs and exposes correlation IDs", () => {
    const request = event();
    const error = new Error("private internal detail");
    const result = handleError({ kind: "unknown", error, event: request });
    expect(result).toMatchObject({
      message: "An unexpected error occurred",
      requestId: "request-1",
      errorId: expect.any(String),
    });
    expect(JSON.stringify(result)).not.toContain("private internal detail");
    expect(request.locals.errorStackTrace).toBe(error.stack);
    expect(logError).toHaveBeenCalledWith(500, "unknown", request);
  });
});
