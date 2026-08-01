import { getRequestEvent } from "$app/server";
import { getAuthedUser } from "$lib/api/auth.remote";
import { canModifyGuild } from "$lib/functions/discordapi/permissions";
import { discordReconnectRequired } from "$lib/server/auth/discord-tokens";
import { error, redirect } from "@sveltejs/kit";
import { getGuilds } from "./guilds";

export async function requireGuildAccess(guildId: string) {
  const { locals, url } = getRequestEvent();
  const authedUser = await getAuthedUser();

  if (!authedUser) redirect(302, "/login?next=" + encodeURIComponent(url.pathname));

  const guilds = await getGuilds(authedUser, locals);

  if (!guilds) discordReconnectRequired(url);

  const guild = guilds.find((item) => item.id === guildId);

  if (!guild) redirect(302, "/me/guilds");
  if (!canModifyGuild(guild)) error(403, "you don't have permission to modify this guild");
}
