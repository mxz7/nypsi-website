import { env } from "$env/dynamic/public";
import { getAuthedUser } from "$lib/api/auth.remote";
import { discord } from "$lib/server/auth/oauth.js";
import { storeDiscordTokens } from "$lib/server/auth/discord-tokens";
import { createSession, setSessionCookie } from "$lib/server/auth/sessions";
import prisma from "$lib/server/database.js";
import { OAuth2RequestError } from "arctic";

function loginError(message: string): Response {
  const url = new URL(`${env.PUBLIC_URL}/`);
  url.searchParams.set("loginerror", message);
  return new Response(null, { status: 302, headers: { Location: url.toString() } });
}

export async function GET({ cookies, url }) {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies.get("oauth_state") ?? null;
  const next = cookies.get("login_next") ?? "/";
  const reconnectUserId = cookies.get("oauth_reconnect_user") ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    let message: string;

    if (!code) {
      message = "Missing code";
    } else if (!state) {
      message = "Missing state";
    } else if (!storedState) {
      message = "Missing stored state";
    } else {
      message = "State mismatch";
    }

    return loginError(message);
  }

  try {
    const tokens = await discord.validateAuthorizationCode(code, null);
    const response = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
      },
    });

    if (!response.ok) {
      return loginError("Failed to load your Discord account");
    }

    const user: DiscordUser = await response.json();

    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true },
    });

    if (reconnectUserId) {
      const authedUser = await getAuthedUser();

      if (!authedUser || authedUser.id !== reconnectUserId || user.id !== reconnectUserId) {
        return loginError("Please reconnect the same Discord account");
      }
    } else if (existingUser) {
      const { expiresAt, token } = await createSession(existingUser.id);

      setSessionCookie(cookies, token, expiresAt);
    } else {
      // todo handle unknown user
      return loginError("unknown user");
    }

    await storeDiscordTokens(user.id, tokens);

    const publicUrl = new URL(env.PUBLIC_URL);
    let nextUrl = new URL(next, publicUrl);

    if (nextUrl.origin !== publicUrl.origin) {
      nextUrl = new URL("/", publicUrl);
    }

    nextUrl.searchParams.set(reconnectUserId ? "reconnected" : "loggedin", "true");

    cookies.delete("oauth_state", { path: "/" });
    cookies.delete("login_next", { path: "/" });
    cookies.delete("oauth_reconnect_user", { path: "/" });

    return new Response(null, { status: 302, headers: { Location: nextUrl.toString() } });
  } catch (e) {
    console.error(e);
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return loginError("Invalid authorization code");
    }
    return loginError("An unexpected error occurred");
  }
}

interface DiscordUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
}
