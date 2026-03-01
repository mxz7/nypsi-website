import { env } from "$env/dynamic/public";
import { discord } from "$lib/server/auth/oauth.js";
import { createSession, setSessionCookie } from "$lib/server/auth/sessions";
import prisma from "$lib/server/database.js";
import redis from "$lib/server/redis.js";
import { OAuth2RequestError } from "arctic";

export async function GET({ cookies, url }) {
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies.get("oauth_state") ?? null;
  const next = cookies.get("login_next") ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    console.warn("invalid callback");
    return new Response(null, {
      status: 400,
    });
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
      return new Response(null, { status: 302, headers: { Location: "/" } });
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
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

interface DiscordUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
}
