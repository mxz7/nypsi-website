import prisma from "$lib/server/database.js";
import { redirect } from "@sveltejs/kit";

export async function load({ parent, params }) {
  const parentData = await parent();
  if (!parentData.guilds) return redirect(302, "/me");

  const guild = parentData.guilds.find((g) => g.id === params.guildId);

  if (!guild) return redirect(302, "/me/guilds");

  const hasPermission = (parseInt(guild.permissions) & 0x20) == 0x20;

  if (!hasPermission) return redirect(302, "/me/guilds");

  const query = await prisma.guild.findUnique({
    where: {
      id: guild.id,
    },
    select: {
      chatFilter: true,
      percentMatch: true,
    },
  });

  return {
    guild,
    ...query,
  };
}
