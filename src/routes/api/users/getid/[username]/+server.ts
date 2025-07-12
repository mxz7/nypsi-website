import prisma from "$lib/server/database.js";
import redis from "$lib/server/redis.js";
import { error, json } from "@sveltejs/kit";

export const GET = async ({ params, setHeaders }) => {
  setHeaders({
    "cache-control": "public, max-age=3600, must-revalidate",
  });

  const cache = await redis.get(`cache:usernametoid:${params.username}`);

  if (cache) {
    const cacheData = JSON.parse(cache);

    setHeaders({
      age: (3600 - ((await redis.ttl(`cache:usernametoid:${params.username}`)) || 0)).toString(),
    });

    if (cacheData.id) {
      return json({ id: cacheData.id, username: cacheData.lastKnownUsername });
    }

    return error(404, { message: "unknown user" });
  }

  const query = await prisma.user.findFirst({
    where: {
      lastKnownUsername: { equals: params.username, mode: "insensitive" },
    },
    select: {
      id: true,
      lastKnownUsername: true,
    },
  });

  await redis.set(`cache:usernametoid:${params.username}`, JSON.stringify(query || {}), "EX", 3600);

  if (!query) {
    return error(404, { message: "unknown user" });
  }

  return json({ id: query.id, username: query.lastKnownUsername });
};
