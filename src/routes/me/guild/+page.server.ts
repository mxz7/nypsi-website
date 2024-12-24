import { getGuilds } from "$lib/server/functions/discordapi/guilds.js";
import { error, redirect } from "@sveltejs/kit";

export async function load({ parent, url }) {
  const parentData = await parent();

  if (!parentData.user) return redirect(302, "/login?next=" + encodeURIComponent(url.pathname));

  const guilds = await getGuilds(parentData.user);

  if (!guilds) return error(400, "unknown guilds error");

  if (typeof guilds === "number") return error(guilds, "discord api error");

  return { guilds };
}
