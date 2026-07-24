import { getGuilds } from "$lib/server/functions/discordapi/guilds.js";
import { getAuthedUser } from "$lib/api/auth.remote";
import { discordReconnectRequired } from "$lib/server/auth/discord-tokens";
import { redirect } from "@sveltejs/kit";

export async function load({ locals, url }) {
  const authedUser = await getAuthedUser();

  if (!authedUser) return redirect(302, "/login?next=" + encodeURIComponent(url.pathname));

  const guilds = await getGuilds(authedUser, locals);

  if (!guilds) discordReconnectRequired(url);

  return { user: authedUser, guilds };
}
