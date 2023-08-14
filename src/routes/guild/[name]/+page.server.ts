import getGuildData from "$lib/server/functions/graphs/getGuildData.js";
import type { ApiGuildResponse } from "$lib/types/Guild.js";

export const load = async ({ params, fetch }) => {
  const guild = await fetch(`/api/guild/${params.name}`).then(
    (r) => r.json() as unknown as ApiGuildResponse,
  );
  return {
    guild,
    graphs: {
      balance: guild.success ? getGuildData(guild.guild.guildName, "balance") : null,
      xp: guild.success ? getGuildData(guild.guild.guildName, "xp") : null,
      level: guild.success ? getGuildData(guild.guild.guildName, "level") : null,
    },
  };
};
