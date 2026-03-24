import { env } from "$env/dynamic/private";
import prisma from "$lib/server/database.js";
import { getGuilds } from "$lib/server/functions/discordapi/guilds.js";
import { canModifyGuild } from "$lib/server/functions/discordapi/permissions";
import { error, fail, redirect } from "@sveltejs/kit";

export async function load({ parent, params }) {
  const parentData = await parent();
  if (!parentData.guilds) return redirect(302, "/me");

  const guild = parentData.guilds.find((g) => g.id === params.guildId);

  if (!guild) return redirect(302, "/me/guilds");

  const hasPermission = (parseInt(guild.permissions) & 0x20) == 0x20;

  if (!hasPermission) return redirect(302, "/me/guilds");

  const query = prisma.chatFilter.findMany({
    where: {
      guildId: guild.id,
    },
    select: {
      content: true,
      percentMatch: true,
    },
  });

  return {
    guild,
    filter: await query,
  };
}

export const actions = {
  delete: async ({ request, params, locals }) => {
    const auth = await locals.validate();

    if (!auth.user) return redirect(302, "/login?next=" + encodeURIComponent(request.url));

    const guilds = await getGuilds(auth.user, locals);

    if (!guilds) return error(400, "unknown guilds error");

    if (typeof guilds === "number") return error(guilds, "discord api error");

    const guild = guilds.find((g) => g.id === params.guildId);

    if (!guild) return redirect(302, "/me/guilds");

    if (!canModifyGuild(guild)) error(403, "you don't have permission to modify this guild");

    const formData = await request.formData();

    const content = formData.get("content")?.toString();

    if (!content) return fail(400);

    await prisma.chatFilter.delete({
      where: {
        guildId_content: {
          content,
          guildId: params.guildId,
        },
      },
    });

    await fetch(`${env.BOT_SERVER_URL}/redis`, {
      method: "delete",
      body: `cache:guild:chatfilter:${params.guildId}`,
      headers: { authorization: `Bearer ${env.BOT_API_AUTH}` },
    });
  },
  edit: async ({ request, params, locals }) => {
    const auth = await locals.validate();

    if (!auth.user) return redirect(302, "/login?next=" + encodeURIComponent(request.url));

    const guilds = await getGuilds(auth.user, locals);

    if (!guilds) return error(400, "unknown guilds error");

    if (typeof guilds === "number") return error(guilds, "discord api error");

    const guild = guilds.find((g) => g.id === params.guildId);

    if (!guild) return redirect(302, "/me/guilds");

    if (!canModifyGuild(guild)) error(403, "you don't have permission to modify this guild");

    const formData = await request.formData();

    const content = formData.get("content")?.toString();

    if (!content) return fail(400, { message: "no content" });

    const percentage = formData.get("percent")?.toString();

    if (!percentage) return fail(400, { message: "invalid percent" });

    const percentageNumber = parseInt(percentage);

    if (isNaN(percentageNumber)) return fail(400, { message: "invalid percent" });

    if (percentageNumber < 1 || percentageNumber > 100)
      return fail(400, { message: "invalid percent" });

    await prisma.chatFilter.update({
      where: {
        guildId_content: {
          content,
          guildId: params.guildId,
        },
      },
      data: {
        percentMatch: percentageNumber,
      },
    });

    await fetch(`${env.BOT_SERVER_URL}/redis`, {
      method: "delete",
      body: `cache:guild:chatfilter:${params.guildId}`,
      headers: { authorization: `Bearer ${env.BOT_API_AUTH}` },
    });
  },
};
