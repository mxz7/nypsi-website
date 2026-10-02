import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  event: { cookies: {}, locals: {} as App.Locals },
  getSessionCookie: vi.fn(),
  validateSession: vi.fn(),
  invalidateSession: vi.fn(),
  deleteSessionCookie: vi.fn(),
  refreshAll: vi.fn(),
  caches: [] as Map<string, unknown>[],
}));
vi.mock("$app/server", () => ({
  getRequestEvent: () => mocks.event,
  requested: () => ({ refreshAll: mocks.refreshAll }),
  form: (callback: unknown) => Object.assign(callback, { __: { type: "form" } }),
  query: (...args: any[]) => {
    const handler = args.at(-1);
    const schema = args.length === 2 ? args[0] : undefined;
    const cache = new Map();
    mocks.caches.push(cache);
    const remote = (input?: unknown) => {
      const key = JSON.stringify(input);
      if (!cache.has(key))
        cache.set(
          key,
          Promise.resolve().then(() => handler(schema ? schema.parse(input) : undefined)),
        );
      return Object.assign(Promise.resolve(cache.get(key)), {
        set: (value: unknown) => cache.set(key, Promise.resolve(value)),
      });
    };
    return Object.assign(remote, { __: { type: "query" } });
  },
}));
vi.mock("#lib/server/auth/sessions.js", () => ({
  getSessionCookie: mocks.getSessionCookie,
  validateSession: mocks.validateSession,
  invalidateSession: mocks.invalidateSession,
  deleteSessionCookie: mocks.deleteSessionCookie,
}));
import { getAuthedUser, requireAuth, logOut } from "#lib/api/auth.remote.js";

const user = { id: "user-1" };
const auth = { user, session: { id: "session-1" } };

describe("authentication queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.event.locals = {} as App.Locals;
    mocks.caches.forEach((cache) => cache.clear());
    mocks.getSessionCookie.mockReturnValue("token");
    mocks.validateSession.mockResolvedValue(auth);
  });

  it("shares session validation and populates the logging user", async () => {
    const users = await Promise.all([getAuthedUser(), requireAuth("/me/stats")]);
    expect(users).toEqual([user, user]);
    expect(mocks.validateSession).toHaveBeenCalledTimes(1);
    expect(mocks.event.locals.auth).toEqual(auth);
    expect(mocks.event.locals.authedUser).toEqual(user);
  });

  it("returns null for optional authentication without a session cookie", async () => {
    mocks.getSessionCookie.mockReturnValue(undefined);
    expect(await getAuthedUser()).toBeNull();
    expect(mocks.validateSession).not.toHaveBeenCalled();
    expect(mocks.event.locals.authedUser).toBeNull();
  });

  it("redirects mandatory login with the explicit local return path", async () => {
    mocks.validateSession.mockResolvedValue(null);
    await expect(requireAuth("/me/guilds?tab=settings")).rejects.toMatchObject({
      status: 303,
      location: "/login?next=%2Fme%2Fguilds%3Ftab%3Dsettings",
    });
  });

  it("rejects external and backslash return destinations", async () => {
    for (const destination of [
      "https://external.example",
      "//external.example",
      "/\\external.example",
    ]) {
      await expect(requireAuth(destination)).rejects.toThrow();
    }
    expect(mocks.validateSession).not.toHaveBeenCalled();
  });

  it("invalidates the session, clears the real session cookie, and refreshes optional auth", async () => {
    expect(await getAuthedUser()).toEqual(user);
    await expect(logOut()).rejects.toMatchObject({ status: 303, location: "/" });
    expect(mocks.invalidateSession).toHaveBeenCalledWith("session-1");
    expect(mocks.deleteSessionCookie).toHaveBeenCalledWith(mocks.event.cookies);
    expect(await getAuthedUser()).toBeNull();
    expect(mocks.refreshAll).toHaveBeenCalledTimes(1);
    expect(mocks.event.locals.auth).toBeNull();
  });

  it("still clears expired session cookies when logging out", async () => {
    mocks.validateSession.mockResolvedValue(null);
    await expect(logOut()).rejects.toMatchObject({ status: 303, location: "/" });
    expect(mocks.deleteSessionCookie).toHaveBeenCalledWith(mocks.event.cookies);
    expect(mocks.invalidateSession).not.toHaveBeenCalled();
  });
});
