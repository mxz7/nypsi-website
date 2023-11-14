import {
  DISCORD_OAUTH_CLIENTID,
  DISCORD_OAUTH_REDIRECT,
  DISCORD_OAUTH_SECRET,
} from "$env/static/private";
import type { UserSession } from "$lib/types/User.js";

export const load = async ({ cookies, fetch }) => {
  let user: UserSession;

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

    if (res.error || res.message) {
      console.log("logout redirect 1");
      console.log(res);
      console.log(cookies.getAll());

      cookies.delete("discord_access_token");
      cookies.delete("discord_refresh_token");
      return { user: { authenticated: false } as UserSession };
    }

    cookies.set("discord_access_token", res.access_token, {
      maxAge: res.expires_in / 2,
      path: "/",
    });
    cookies.set("discord_refresh_token", res.refresh_token, {
      maxAge: 7.776e6, // 60 days
      path: "/",
    });

    if (!res || res.error) {
      console.log("logout redirect 2");
      console.log(res);
      console.log(cookies.getAll());

      cookies.delete("discord_access_token");
      cookies.delete("discord_refresh_token");
      return { user: { authenticated: false } as UserSession };
    }

    const userRequest = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${res.access_token}` },
    }).then((r) => r.json());

    if (userRequest.error || userRequest.message) {
      console.error(userRequest);
      console.log("logout redirect 3");
      console.log(res);
      console.log(cookies.getAll());

      cookies.delete("discord_access_token");
      cookies.delete("discord_refresh_token");
      return { user: { authenticated: false } as UserSession };
    }

    user = {
      authenticated: true,
      avatar: userRequest.avatar,
      username: userRequest.username,
      id: userRequest.id,
    };
  } else if (cookies.get("discord_access_token")) {
    const userRequest = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${cookies.get("discord_access_token")}` },
    }).then((r) => r.json());

    if (userRequest.error || userRequest.message) {
      cookies.delete("discord_access_token");
      cookies.delete("discord_refresh_token");
      console.error(userRequest);
      console.log("logout redirect 4");
      console.log(userRequest);
      console.log(cookies.getAll());

      cookies.delete("discord_access_token");
      cookies.delete("discord_refresh_token");
      return { user: { authenticated: false } as UserSession };
    }

    user = {
      authenticated: true,
      avatar: userRequest.avatar,
      username: userRequest.username,
      id: userRequest.id,
    };
  }

  if (!user) user = { authenticated: false };

  if (user.authenticated && !user.id) {
    console.log(user);
    console.log(cookies.getAll());
  }

  return {
    user: user as UserSession,
    streamed: {
      premium: user.authenticated
        ? fetch(`/api/user/ispremium/${user.id}`).then(
            (r) => r.json().then((r) => r?.premium || false) as Promise<boolean>,
          )
        : false,
    },
  };
};
