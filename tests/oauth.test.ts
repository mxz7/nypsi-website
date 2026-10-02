import { beforeEach, describe, expect, it, vi } from "vitest";

const { getAuthedUser, createAuthorizationURL } = vi.hoisted(() => ({
  getAuthedUser: vi.fn(),
  createAuthorizationURL: vi.fn(),
}));
vi.mock("#lib/api/auth.remote.js", () => ({ getAuthedUser }));
vi.mock("#lib/server/auth/oauth.js", () => ({ discord: { createAuthorizationURL } }));
import { GET } from "../src/routes/(auth)/login/+server";

function request(next = "/me/stats", reauthorize = false) {
  const url = new URL("https://nypsi.xyz/login");
  url.searchParams.set("next", next);
  if (reauthorize) url.searchParams.set("reauthorize", "true");
  return { url, cookies: { set: vi.fn(), delete: vi.fn() } } as unknown as Parameters<
    typeof GET
  >[0];
}

describe("Discord OAuth redirects", () => {
  beforeEach(() => {
    getAuthedUser.mockReset().mockResolvedValue(null);
    createAuthorizationURL
      .mockReset()
      .mockReturnValue(new URL("https://discord.com/oauth2/authorize?state=test"));
  });

  it("permits Discord authorization through SvelteKit's real redirect validation", async () => {
    const event = request();
    await expect(GET(event)).rejects.toMatchObject({
      status: 302,
      location: "https://discord.com/oauth2/authorize?state=test",
    });
    expect(event.cookies.set).toHaveBeenCalledWith("login_next", "/me/stats", expect.anything());
  });

  it("rejects an unexpected authorization origin", async () => {
    createAuthorizationURL.mockReturnValue(new URL("https://unexpected.example/auth"));
    await expect(GET(request())).rejects.toThrow("redirect_external_not_in_allowlist");
  });

  it("keeps authenticated users on the local home page", async () => {
    getAuthedUser.mockResolvedValue({ id: "user-1" });
    await expect(GET(request())).rejects.toMatchObject({ status: 302, location: "/" });
    expect(createAuthorizationURL).not.toHaveBeenCalled();
  });

  it("allows authenticated users to reconnect the same account", async () => {
    getAuthedUser.mockResolvedValue({ id: "user-1" });
    const event = request("/me/guilds", true);
    await expect(GET(event)).rejects.toMatchObject({
      status: 302,
      location: "https://discord.com/oauth2/authorize?state=test",
    });
    expect(event.cookies.set).toHaveBeenCalledWith(
      "oauth_reconnect_user",
      "user-1",
      expect.anything(),
    );
  });
});
