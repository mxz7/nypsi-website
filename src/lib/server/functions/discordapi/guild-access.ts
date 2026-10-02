import { getRequestEvent } from "$app/server";
import { requireAuth } from "#lib/api/auth.remote.js";
import { canModifyGuild } from "#lib/functions/discordapi/permissions.js";
import { discordReconnectRequired } from "#lib/server/auth/discord-tokens.js";
import { error, redirect } from "@sveltejs/kit";
import { getGuilds } from "./guilds";

export async function requireGuildAccess(guildId: string) {
  const { locals, url } = getRequestEvent();
  const authedUser = await requireAuth(url.pathname + url.search);

  const guilds = await getGuilds(authedUser, locals);

  if (!guilds) discordReconnectRequired(url);

  const guild = guilds.find((item) => item.id === guildId);

  if (!guild) redirect(302, "/me/guilds");
  if (!canModifyGuild(guild)) error(403, "you don't have permission to modify this guild");
}
