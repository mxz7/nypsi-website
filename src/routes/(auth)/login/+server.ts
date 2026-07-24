import { getAuthedUser } from "$lib/api/auth.remote";
import { discord } from "$lib/server/auth/oauth.js";
import { redirect } from "@sveltejs/kit";
import { generateState } from "arctic";

export async function GET({ cookies, locals, url }) {
  const authedUser = await getAuthedUser();
  const reauthorize = url.searchParams.has("reauthorize");

  if (authedUser && !reauthorize) return redirect(302, "/");

  const state = generateState();
  const oauthUrl = discord.createAuthorizationURL(state, null, ["identify", "guilds"]);
  const next = url.searchParams.get("next");

  cookies.set("oauth_state", state, {
    path: "/",
    secure: import.meta.env.PROD,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });
  if (next) cookies.set("login_next", next, { path: "/", maxAge: 60 * 10 });
  if (reauthorize && authedUser) {
    cookies.set("oauth_reconnect_user", authedUser.id, {
      path: "/",
      secure: import.meta.env.PROD,
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "lax",
    });
  } else {
    cookies.delete("oauth_reconnect_user", { path: "/" });
  }

  redirect(302, oauthUrl.toString());
}
