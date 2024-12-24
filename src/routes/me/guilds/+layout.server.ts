import { getGuilds } from "$lib/server/functions/discordapi/guilds.js";
import { error, redirect } from "@sveltejs/kit";

export async function load({ locals, url }) {
  const auth = await locals.validate();

  if (!auth) return redirect(302, "/login?next=" + encodeURIComponent(url.pathname));

  const guilds = await getGuilds(auth.user);

  if (!guilds) return error(400, "unknown guilds error");

  if (typeof guilds === "number") return error(guilds, "discord api error");

  return { user: auth.user, guilds };
}
