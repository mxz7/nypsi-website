import prisma from "$lib/server/database.js";
import { redirect } from "@sveltejs/kit";

export async function load({ params, url, parent }) {
  const parentData = await parent();
  if (!parentData.guilds) return redirect(302, "/me");

  const guild = parentData.guilds.find((g) => g.id === params.guildId);

  if (!guild) return redirect(302, "/me/guilds");

  const hasPermission = (parseInt(guild.permissions) & 0x20) == 0x20;

  if (!hasPermission) return redirect(302, "/me/guilds");

  const modlogs = await prisma.moderationCase.findMany({
    where: { guildId: guild.id },
    orderBy: { caseId: "desc" },
    select: {
      caseId: true,
      command: true,
      type: true,
      moderator: true,
      user: true,
    },
    take: 25,
    skip: (parseInt(url.searchParams.get("page") || "1") - 1) * 25,
  });

  return { guild, modlogs };
}
