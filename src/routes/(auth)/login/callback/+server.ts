import { env } from "$env/dynamic/public";
import { discord } from "$lib/server/auth/oauth.js";
import { createSession, setSessionCookie } from "$lib/server/auth/sessions";
import prisma from "$lib/server/database.js";
import redis from "$lib/server/redis.js";
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
    const user: DiscordUser = await response.json();

    const existingUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true },
    });

    if (existingUser) {
      const { expiresAt, token } = await createSession(existingUser.id);

      setSessionCookie(cookies, token, expiresAt);
    } else {
      // todo handle unknown user
      return loginError("unknown user");
    }

    await redis.set(
      `discord:accesstoken:${user.id}`,
      tokens.accessToken(),
      "EX",
      tokens.accessTokenExpiresInSeconds(),
    );

    const nextUrl = new URL(`${env.PUBLIC_URL}${next ? next : ""}`);

    nextUrl.searchParams.set("loggedin", "true");

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
