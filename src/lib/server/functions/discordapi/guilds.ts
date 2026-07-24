import { dev } from "$app/environment";
import { deleteDiscordAccessToken, getDiscordAccessToken } from "$lib/server/auth/discord-tokens";
import prisma from "$lib/server/database";
import redis from "$lib/server/redis";
import type { User } from "$lib/types/Auth";
import type { DiscordGuild } from "$lib/types/Discord";
import { error } from "@sveltejs/kit";
import { inPlaceSort } from "fast-sort";

export async function getGuilds(user: User, locals?: any): Promise<null | DiscordGuild[]> {
  let accessToken = await getDiscordAccessToken(user.id);

  if (!accessToken) return null;

  const cache = await redis.get(`discord:guilds:${user.id}`);

  if (cache) return JSON.parse(cache) as DiscordGuild[];

  let guildsResponse = await fetchGuilds(accessToken);

  if (guildsResponse.status === 401) {
    await deleteDiscordAccessToken(user.id);
    accessToken = await getDiscordAccessToken(user.id);

    if (!accessToken) return null;

    guildsResponse = await fetchGuilds(accessToken);
  }

  if (!guildsResponse.ok) {
    if (dev) console.error(guildsResponse);

    if (locals) {
      locals.error = `discord guilds request failed: ${guildsResponse.status} ${guildsResponse.statusText}`;
    }

    error(guildsResponse.status, guildsResponse.statusText);
  }

  let guilds: DiscordGuild[] = await guildsResponse.json();

  const nypsiGuilds = await prisma.guild
    .findMany({
      where: { id: { in: guilds.map((i) => i.id) } },
      select: { id: true },
    })
    .then((q) => q.map((i) => i.id));

  guilds = guilds.filter((i) => nypsiGuilds.includes(i.id));

  inPlaceSort(guilds).asc([(g) => g.name]);

  await redis.set(`discord:guilds:${user.id}`, JSON.stringify(guilds), "EX", 60);

  return guilds;
}

function fetchGuilds(accessToken: string) {
  return fetch("https://discord.com/api/v10/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
