import {
  DISCORD_OAUTH_CLIENTID,
  DISCORD_OAUTH_REDIRECT,
  DISCORD_OAUTH_SECRET,
} from "$env/static/private";
import { PUBLIC_OAUTH_URL } from "$env/static/public";
import { error, redirect } from "@sveltejs/kit";

export const GET = async ({ url, fetch, cookies }) => {
  const code = url.searchParams.get("code");

  if (code) {
    const res = await fetch("https://discord.com/api/oauth2/token", {
      method: "post",
      body: new URLSearchParams({
        client_id: DISCORD_OAUTH_CLIENTID,
        client_secret: DISCORD_OAUTH_SECRET,
        grant_type: "authorization_code",
        redirect_uri: DISCORD_OAUTH_REDIRECT,
        code,
        scope: "identify",
      }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }).then((r) => r.json());

    if (res.error) {
      console.error(res);
      throw error(400, { message: "something went wrong", ...res });
    }

    cookies.set("discord_access_token", res.access_token, {
      maxAge: res.expires_in / 2,
      path: "/",
    });
    cookies.set("discord_refresh_token", res.refresh_token, {
      maxAge: 7.776e6, // 60 days
      path: "/",
    });

    throw redirect(302, "/");
  }

  throw redirect(302, PUBLIC_OAUTH_URL);
};
