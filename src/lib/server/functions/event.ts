import prisma from "$lib/server/database";
import redis from "$lib/server/redis";
import type { Event, Prisma } from "@prisma/client";

export type NypsiEvent = Awaited<ReturnType<typeof getEventNoCache>>;

async function getEventNoCache(id?: number) {
  let where: Prisma.EventWhereInput;

  if (id) {
    where = { id };
  } else {
    where = {
      AND: [{ completed: false, expiresAt: { gt: new Date() } }],
    };
  }

  const query = await prisma.event.findFirst({
    where,
    omit: {
      ownerId: true,
    },
    include: {
      contributions: {
        orderBy: { contribution: "desc" },
        select: {
          contribution: true,
          user: {
            select: {
              lastKnownUsername: true,
              avatar: true,
              id: true,
            },
          },
        },
      },
      owner: {
        select: {
          lastKnownUsername: true,
          avatar: true,
          id: true,
        },
      },
    },
  });

  return query;
}

export async function getEvent(id?: number, longCache = false): Promise<NypsiEvent> {
  const cache = await redis.get(`cache:events:${id}`);

  if (cache) {
    return JSON.parse(cache) as NypsiEvent;
  }

  const event = await getEventNoCache(id);

  await redis.set(
    `cache:events:${id}`,
    JSON.stringify(event, (_key, value) => (typeof value === "bigint" ? Number(value) : value)),
    "EX",
    longCache ? 7200 : 7,
  );

  return event;
}

export async function getUserPosition(eventId: number, userId: string) {
  const cache = await redis.get(`cache:events:position:${eventId}:${userId}`);

  if (cache) {
    return parseInt(cache);
  }

  const query = await prisma.eventContribution.findUnique({
    where: {
      userId_eventId: {
        userId,
        eventId,
      },
    },
    select: {
      contribution: true,
    },
  });

  if (!query) {
    await redis.set(`cache:events:position:${eventId}:${userId}`, -1, "EX", 7);

    return -1;
  }

  const position = await prisma.eventContribution.count({
    where: {
      AND: [{ eventId }, { contribution: { gt: query.contribution } }],
    },
  });

  await redis.set(`cache:events:position:${eventId}:${userId}`, position + 1, "EX", 7);

  return position + 1;
}

export async function getTotalUsers(eventId: number): Promise<number> {
  const cache = await redis.get(`cache:events:totalusers:${eventId}`);

  if (cache) {
    return parseInt(cache);
  }

  const query = await prisma.eventContribution.count({
    where: {
      eventId,
    },
  });

  await redis.set(`cache:events:totalusers:${eventId}`, query.toString(), "EX", 30);

  return query;
}

export async function getPastEvents(): Promise<Event[]> {
  const cache = await redis.get("cache:events:pasts");

  if (cache) {
    return JSON.parse(cache) as Event[];
  }

  const query = await prisma.event.findMany({
    where: {
      OR: [{ completed: true }, { expiresAt: { lt: new Date() } }],
    },
  });

  await redis.set(
    "cache:events:pasts",
    JSON.stringify(query, (_, value) => (typeof value === "bigint" ? Number(value) : value)),
    "EX",
    300,
  );

  return query;
}
