import { query } from "$app/server";
import { Constants } from "$lib/data/constants";
import { RedisCache } from "$lib/server/cache";
import prisma from "$lib/server/database";
import { requireGuildAccess } from "$lib/server/functions/discordapi/guild-access";
import z from "zod";

const guildIdSchema = z.string().regex(Constants.SNOWFLAKE_REGEX, "invalid guild");

type Modlog = {
  caseId: number;
  command: string;
  moderator: string;
  type: string;
  user: string;
};

const recentModlogsCache = new RedisCache<Modlog[]>("cache:guild:recent-modlogs", 900);

export const getRecentModlogs = query(guildIdSchema, async (guildId) => {
  await requireGuildAccess(guildId);

  const cached = await recentModlogsCache.get(guildId);
  if (cached !== null) return cached;

  const modlogs = await prisma.moderationCase.findMany({
    where: { guildId },
    orderBy: { caseId: "desc" },
    select: {
      caseId: true,
      command: true,
      moderator: true,
      type: true,
      user: true,
    },
    take: 25,
  });

  await recentModlogsCache.set(guildId, modlogs);

  return modlogs;
});
