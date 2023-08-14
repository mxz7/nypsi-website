import prisma from "$lib/server/database.js";
import { json } from "@sveltejs/kit";

export async function GET({ params }) {
  const query = await prisma.economyGuild.findFirst({
    where: {
      guildName: { mode: "insensitive", equals: params.name },
    },
    select: {
      balance: true,
      createdAt: true,
      guildName: true,
      level: true,
      motd: true,
      tokens: true,
      xp: true,
      owner: {
        select: {
          user: {
            select: {
              lastKnownUsername: true,
            },
          },
        },
      },
      members: {
        orderBy: {
          joinedAt: "desc",
        },
        select: {
          contributedMoney: true,
          contributedXp: true,
          joinedAt: true,
          economy: {
            select: {
              user: {
                select: {
                  lastKnownUsername: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (query) return json({ success: true, guild: query });
  return json({ success: false });
}
