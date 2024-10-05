import getGuildData from "$lib/server/functions/graphs/getGuildData.js";
import type { ApiGuildResponse } from "$lib/types/Guild.js";

export const load = async ({ params, fetch, setHeaders }) => {
  setHeaders({ "cache-control": "public, max-age=600" });

  const guild = await fetch(`/api/guild/${params.name}`).then(
    (r) => r.json() as unknown as ApiGuildResponse,
  );

  if (!guild.success) return { guild };
  return {
    guild,
    graphs: {
      balance: getGuildData(guild.guild.guildName, "balance"),
      xp: getGuildData(guild.guild.guildName, "xp"),
      level: getGuildData(guild.guild.guildName, "level"),
    },
  };
};
