import { canModifyGuild } from "$lib/functions/discordapi/permissions";
import { redirect } from "@sveltejs/kit";

export async function load({ parent, params }) {
  const parentData = await parent();
  if (!parentData.guilds) return redirect(302, "/me");

  const guild = parentData.guilds.find((g) => g.id === params.guildId);

  if (!guild) return redirect(302, "/me/guilds");

  const hasPermission = canModifyGuild(guild);

  return { guild, hasPermission };
}
