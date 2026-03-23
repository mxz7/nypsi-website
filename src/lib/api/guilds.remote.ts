import { query } from "$app/server";
import prisma from "$lib/server/database";
import { error } from "@sveltejs/kit";
import z from "zod";

export const getGuildByName = query(z.string(), async (guildName) => {
  const guild = await prisma.economyGuild.findUnique({
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

  if (!guild) {
    error(404, "unknown guild");
  }

  return guild;
});
