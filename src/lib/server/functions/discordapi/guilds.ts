import prisma from "$lib/server/database";
import redis from "$lib/server/redis";
import type { DiscordGuild } from "$lib/types/Discord";
import type { User } from "lucia";

export async function getGuilds(user: User): Promise<null | number | DiscordGuild[]> {
  const accessToken = await redis.get(`discord:accesstoken:${user.id}`);

  if (!accessToken) return null;

  const cache = await redis.get(`discord:guilds:${user.id}`);

  if (cache) return JSON.parse(cache) as DiscordGuild[];

  const guildsResponse = await fetch(`https://discord.com/api/v10/users/@me/guilds`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!guildsResponse.ok) {
    if (guildsResponse.status === 401) {
      await redis.del(`discord:accesstoken:${user.id}`);
    }

    return guildsResponse.status;
  }

  const guilds: DiscordGuild[] = await guildsResponse.json();

  for (const guild of guilds) {
    const query = await prisma.guild.findUnique({ where: { id: guild.id }, select: { id: true } });

    if (!query) {
      guilds.splice(guilds.indexOf(guild), 1);
    }
  }

  await redis.set(`discord:guilds:${user.id}`, JSON.stringify(guilds), "EX", 5);

  return guilds;
}
