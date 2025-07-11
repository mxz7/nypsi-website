import prisma from "$lib/server/database";
import redis from "$lib/server/redis";
import type { Event, Prisma } from "@prisma/client";

export async function getCurrentEvent(id?: number) {
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
        take: 10,
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

export type CurrentEvent = Awaited<ReturnType<typeof getCurrentEvent>>;

export async function getUserPosition(eventId: number, userId: string) {
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

  if (!query) return -1;

  const position = await prisma.eventContribution.count({
    where: {
      AND: [{ eventId }, { contribution: { gt: query.contribution } }],
    },
  });

  return position + 1;
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
