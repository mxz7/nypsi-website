import { getGuilds } from "$lib/server/functions/discordapi/guilds.js";
import { getAuthedUser } from "$lib/api/auth.remote";
import { error, redirect } from "@sveltejs/kit";

export async function load({ locals, url }) {
  const authedUser = await getAuthedUser();

  if (!authedUser) return redirect(302, "/login?next=" + encodeURIComponent(url.pathname));

  const guilds = await getGuilds(authedUser, locals);

  if (!guilds) return error(400, "unknown guilds error");

  if (typeof guilds === "number") return error(guilds, "discord api error");

  return { user: authedUser, guilds };
}
