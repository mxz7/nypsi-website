import { discord } from "$lib/server/functions/auth.js";
import { redirect } from "@sveltejs/kit";
import { generateState } from "arctic";

export async function GET({ cookies, locals, url }) {
  if (await locals.validate()) return redirect(302, "/");

  const state = generateState();
  const oauthUrl = await discord.createAuthorizationURL(state, { scopes: ["identify"] });
  const next = url.searchParams.get("next");

  cookies.set("oauth_state", state, {
    path: "/",
    secure: import.meta.env.PROD,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });
  if (next) cookies.set("login_next", next, { path: "/", maxAge: 60 * 10 });

  redirect(302, oauthUrl.toString());
}
