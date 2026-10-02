import { BOT_SERVER_URL, BOT_API_AUTH } from "$app/env/private";
import { canModifyGuild } from "#lib/functions/discordapi/permissions.js";
import { error, redirect } from "@sveltejs/kit";

type DashboardData = {
  channels: {
    id: string;
    name: string;
    parentId: string | null;
    parentName: string | null;
    position: number;
  }[];
  settings: {
    altPunish: boolean;
    disabledChannels: string[];
    modlogsChannelId: string | null;
    modlogsEnabled: boolean;
    prefixes: string[];
    slashOnly: boolean;
  };
};

export async function load({ parent, params }) {
  const parentData = await parent();
  if (!parentData.guilds) return redirect(302, "/me");

  const guild = parentData.guilds.find((g) => g.id === params.guildId);

  if (!guild) return redirect(302, "/me/guilds");

  const hasPermission = canModifyGuild(guild);

  if (!hasPermission) return { guild, hasPermission, dashboard: null };

  const response = await fetch(`${BOT_SERVER_URL}/guilds/${guild.id}/settings`, {
    headers: { authorization: `Bearer ${BOT_API_AUTH}` },
  });

  if (!response.ok) {
    error(502, "unable to load server settings from nypsi");
  }

  return {
    guild,
    hasPermission,
    dashboard: (await response.json()) as DashboardData,
  };
}
