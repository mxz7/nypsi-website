import prisma from "$lib/server/database.js";
import redis from "$lib/server/redis.js";
import { fail } from "@sveltejs/kit";

export async function load({ parent }) {
  const { user } = await parent();

  if (!user) return;

  const levelCheck = await checkLevel(user.id);

  if (!levelCheck) return { levelCheck };

  const tracking = await getTracking(user.id);

  const avatars = await prisma.username.findMany({
    where: {
      AND: [{ userId: user.id }, { type: "avatar" }],
    },
    select: {
      createdAt: true,
      id: true,
      value: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { avatars, levelCheck, tracking };
}

async function checkLevel(userId: string) {
  const cache = await redis.get(`cache:level:${userId}`);

  if (cache) {
    if (parseInt(cache) < 500) return false;
    return true;
  }

  const query = await prisma.economy.findUnique({
    where: {
      userId,
    },
    select: {
      level: true,
      prestige: true,
    },
  });

  let level = query.level;

  while (query.prestige > 0) {
    level += 100;
    query.prestige -= 1;
  }

  await redis.set(`cache:level:${userId}`, level, "EX", 600);

  return level >= 500;
}

async function getTracking(userId: string) {
  const cache = await redis.get(`cache:tracking:${userId}`);

  if (cache) {
    return true;
  }

  const query = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      tracking: true,
    },
  });

  if (query.tracking) {
    await redis.set(`cache:tracking:${userId}`, true, "EX", 600);
    return true;
  }

  return false;
}

export const actions = {
  delete: async ({ request, locals }) => {
    const formData = await request.formData();

    if (!formData.get("id")) return fail(400);

    const auth = await locals.validate();

    if (!auth.user) return fail(401);

    await prisma.username.deleteMany({
      where: {
        AND: [{ userId: auth.user.id }, { id: parseInt(formData.get("id").toString()) }],
      },
      limit: 1,
    });
  },
};
