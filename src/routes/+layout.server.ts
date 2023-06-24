import {
  DISCORD_OAUTH_CLIENTID,
  DISCORD_OAUTH_REDIRECT,
  DISCORD_OAUTH_SECRET,
} from "$env/static/private";
import type { User, UserSession } from "$lib/types/User.js";
import { error, redirect } from "@sveltejs/kit";

export const load = async ({ cookies, fetch }) => {
  const user: UserSession = { authenticated: false };

  console.log(cookies.getAll());

  if (cookies.get("discord_refresh_token") && !cookies.get("discord_access_token")) {
    const res = await fetch("https://discord.com/api/oauth2/token", {
      method: "post",
      body: new URLSearchParams({
        client_id: DISCORD_OAUTH_CLIENTID,
        client_secret: DISCORD_OAUTH_SECRET,
        grant_type: "refresh_token",
        redirect_uri: DISCORD_OAUTH_REDIRECT,
        refresh_token: cookies.get("discord_refresh_token") as string,
        scope: "identify",
      }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then((r) => r.json());

    if (res.error) {
      throw redirect(307, "/logout");
    }

    const accessTokenExpire = new Date(Date.now() + res.expires_in); // 10 minutes
    const refreshTokenExpire = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    cookies.set("discord_access_token", res.access_token, {
      expires: accessTokenExpire,
      path: "/",
    });
    cookies.set("discord_refresh_token", res.refresh_token, {
      expires: refreshTokenExpire,
      path: "/",
    });

    if (!res || res.error) {
      throw redirect(307, "/logout");
    }

    const userRequest = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${res.access_token}` },
    }).then((r) => r.json());

    if (userRequest.error) {
      cookies.delete("discord_access_token");
      cookies.delete("discord_refresh_token");
      console.error(userRequest.error);
      throw error(400, { message: "something went wrong", ...userRequest });
    }

    (user as unknown as User).authenticated = true;
    (user as unknown as User).avatar = userRequest.avatar;
    (user as unknown as User).discriminator = userRequest.discriminator;
    (user as unknown as User).username = userRequest.username;
    (user as unknown as User).id = userRequest.id;
  } else if (cookies.get("discord_access_token")) {
    const userRequest = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${cookies.get("discord_access_token")}` },
    }).then((r) => r.json());

    if (userRequest.error) {
      cookies.delete("discord_access_token");
      cookies.delete("discord_refresh_token");
      console.error(userRequest.error);
      throw error(400, { message: "something went wrong", ...userRequest });
    }

    (user as unknown as User).authenticated = true;
    (user as unknown as User).avatar = userRequest.avatar;
    (user as unknown as User).discriminator = userRequest.discriminator;
    (user as unknown as User).username = userRequest.username;
    (user as unknown as User).id = userRequest.id;
  }

  return { user: user as UserSession };
};
