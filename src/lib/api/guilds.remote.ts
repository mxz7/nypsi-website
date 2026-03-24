import { query } from "$app/server";
import { RedisKey } from "$lib/data/constants";
import prisma from "$lib/server/database";
import { redisDeserialize, redisSerialize } from "$lib/server/functions/redis-json";
import redis from "$lib/server/redis";
import { error } from "@sveltejs/kit";
import z from "zod";

async function getGuildByNameFromDatabase(guildName: string) {
  return prisma.economyGuild.findUnique({
    where: { guildName },
    select: {
      guildName: true,
      avatarId: true,
      level: true,
      motd: true,
      owner: {
        select: {
          user: {
            select: {
              avatar: true,
              lastKnownUsername: true,
            },
          },
        },
      },
      members: {
        select: {
          economy: {
            select: {
              user: {
                select: {
                  lastKnownUsername: true,
                  avatar: true,
                },
              },
            },
          },
        },
        orderBy: {
          joinedAt: "asc",
        },
      },
    },
  });
}

export const getGuildByName = query(z.string(), async (guildName) => {
  const cache = await redis.get(`${RedisKey.guilds.GUILD_BY_NAME}:${guildName}`);

  if (cache) {
    const cacheData = redisDeserialize<Awaited<
      ReturnType<typeof getGuildByNameFromDatabase>
    > | null>(cache);

    if (!cacheData) {
      error(404, "unknown guild");
    }

    return cacheData;
  }

  const guild = await getGuildByNameFromDatabase(guildName);

  if (!guild) {
    error(404, "unknown guild");
  }

  await redis.set(
    `${RedisKey.guilds.GUILD_BY_NAME}:${guildName}`,
    redisSerialize(guild || null),
    "EX",
    300,
  );

  return guild;
});
