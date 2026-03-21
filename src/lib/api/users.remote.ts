import { query } from "$app/server";
import { RedisKey } from "$lib/data/constants";
import prisma from "$lib/server/database";
import redis from "$lib/server/redis";
import z from "zod";

export const getUserId = query<z.ZodString, ApiResult<{ id: string; username: string }>>(
  z.string().toLowerCase(),
  async (username) => {
    const cache = await redis.get(`${RedisKey.users.USERNAME_TO_ID}:${username}`);

    if (cache) {
      const cacheData = JSON.parse(cache);

      if (cacheData.id) {
        return { ok: true, id: cacheData.id, username: cacheData.lastKnownUsername };
      }

      return { ok: false, status: 404, message: "unknown username" };
    }

    const query = await prisma.user.findFirst({
      where: {
        lastKnownUsername: { equals: username, mode: "insensitive" },
      },
      select: {
        id: true,
        lastKnownUsername: true,
      },
    });

    await redis.set(
      `${RedisKey.users.USERNAME_TO_ID}:${username}`,
      JSON.stringify(query || {}),
      "EX",
      3600,
    );

    if (!query) {
      return { ok: false, status: 404, message: "unknown username" };
    }

    return { ok: true, id: query.id, username: query.lastKnownUsername };
  },
);
