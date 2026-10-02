import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getAuthedUser: vi.fn(),
  validateAuthorizationCode: vi.fn(),
  storeDiscordTokens: vi.fn(),
  createSession: vi.fn(),
  setSessionCookie: vi.fn(),
  findUnique: vi.fn(),
  fetch: vi.fn(),
}));
vi.mock("$app/env/public", () => ({ PUBLIC_URL: "https://nypsi.xyz" }));
vi.mock("#lib/api/auth.remote.js", () => ({ getAuthedUser: mocks.getAuthedUser }));
vi.mock("#lib/server/auth/oauth.js", () => ({
  discord: { validateAuthorizationCode: mocks.validateAuthorizationCode },
}));
vi.mock("#lib/server/auth/discord-tokens.js", () => ({
  storeDiscordTokens: mocks.storeDiscordTokens,
}));
vi.mock("#lib/server/auth/sessions.js", () => ({
  createSession: mocks.createSession,
  setSessionCookie: mocks.setSessionCookie,
}));
vi.mock("#lib/server/database.js", () => ({ default: { user: { findUnique: mocks.findUnique } } }));
import { GET } from "../src/routes/(auth)/login/callback/+server";

function event(next = "/me/stats?tab=balance#chart", reconnect?: string) {
  const values = { oauth_state: "state", login_next: next, oauth_reconnect_user: reconnect };
  return {
    url: new URL("https://nypsi.xyz/login/callback?code=code&state=state"),
    cookies: { get: (name: string) => values[name], delete: vi.fn() },
  } as unknown as Parameters<typeof GET>[0];
}

describe("Discord OAuth callback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.validateAuthorizationCode.mockResolvedValue({ accessToken: () => "access-token" });
    mocks.fetch.mockImplementation(async () => Response.json({ id: "user-1" }));
    vi.stubGlobal("fetch", mocks.fetch);
    mocks.findUnique.mockResolvedValue({ id: "user-1" });
    mocks.createSession.mockResolvedValue({ token: "token", expiresAt: new Date() });
    mocks.getAuthedUser.mockResolvedValue({ id: "user-1" });
  });

  it("returns to the local page and preserves search and hash", async () => {
    const request = event();
    const response = await GET(request);
    expect(response.headers.get("location")).toBe(
      "https://nypsi.xyz/me/stats?tab=balance&loggedin=true#chart",
    );
    expect(mocks.setSessionCookie).toHaveBeenCalled();
    expect(request.cookies.delete).toHaveBeenCalledWith("oauth_state", { path: "/" });
  });

  it("falls back to home for external return destinations", async () => {
    for (const next of ["https://external.example", "//external.example", "/\\external.example"]) {
      const response = await GET(event(next));
      expect(response.headers.get("location")).toBe("https://nypsi.xyz/?loggedin=true");
    }
  });

  it("reconnects the same Discord account without creating a new session", async () => {
    const response = await GET(event("/me/guilds", "user-1"));
    expect(response.headers.get("location")).toBe("https://nypsi.xyz/me/guilds?reconnected=true");
    expect(mocks.createSession).not.toHaveBeenCalled();
    expect(mocks.storeDiscordTokens).toHaveBeenCalled();
  });

  it("refuses a different account during reconnect", async () => {
    mocks.fetch.mockResolvedValue(Response.json({ id: "different-user" }));
    const response = await GET(event("/me/guilds", "user-1"));
    expect(new URL(response.headers.get("location")).searchParams.get("loginerror")).toBe(
      "Please reconnect the same Discord account",
    );
    expect(mocks.storeDiscordTokens).not.toHaveBeenCalled();
  });

  it("does not exchange a code with mismatched OAuth state", async () => {
    const request = event();
    request.url.searchParams.set("state", "mismatched");
    const response = await GET(request);
    expect(new URL(response.headers.get("location")).searchParams.get("loginerror")).toBe(
      "State mismatch",
    );
    expect(mocks.validateAuthorizationCode).not.toHaveBeenCalled();
  });
});
