import { query } from "$app/server";
import { RedisKey } from "$lib/data/constants";
import { RedisCache } from "$lib/server/cache";
import prisma from "$lib/server/database";
import { error } from "@sveltejs/kit";
import z from "zod";
import { checkPrivacyHelper, getUserIdHelper } from "./helpers";

type UsernameLookupCacheData = { value: { id: string; lastKnownUsername: string } | null };
type PrivacyCacheData = boolean;
type BaseDataCacheData = { value: Awaited<ReturnType<typeof getBaseDataFromDatabase>> | null };
type CommandUsesCacheData = Awaited<ReturnType<typeof getCommandUsesFromDatabase>>;
type AchievementsCacheData = Awaited<ReturnType<typeof getAchievementsFromDatabase>>;
type InventoryCacheData = Awaited<ReturnType<typeof getInventoryFromDatabase>>;
type MuseumCacheData = Awaited<ReturnType<typeof getMuseumFromDatabase>>;
type MarriagePartnerCacheData = { value: { id: string; lastKnownUsername: string } | null };

const usernameToIdCache = new RedisCache<UsernameLookupCacheData>(RedisKey.users.USERNAME_TO_ID, 3600);
const privacyCache = new RedisCache<PrivacyCacheData>(RedisKey.users.PRIVACY, 600);
const baseDataCache = new RedisCache<BaseDataCacheData>(RedisKey.users.BASE_DATA, 600);
const commandUsesCache = new RedisCache<CommandUsesCacheData>(RedisKey.users.COMMAND_USES, 600);
const achievementsCache = new RedisCache<AchievementsCacheData>(RedisKey.users.ACHIEVEMENTS, 600);
const inventoryCache = new RedisCache<InventoryCacheData>(RedisKey.users.INVENTORY, 600);
const museumCache = new RedisCache<MuseumCacheData>(RedisKey.users.MUSEUM, 600);
const marriagePartnerCache = new RedisCache<MarriagePartnerCacheData>(
  RedisKey.users.MARRIAGE_PARTNER,
  600,
);

export const getUserId = query<z.ZodString, ApiResult<{ id: string; username: string }>>(
  z.string().toLowerCase(),
  async (username) => {
    const cacheData = await usernameToIdCache.get(username);

    if (cacheData !== null) {
      if (cacheData.value) {
        return { ok: true, id: cacheData.value.id, username: cacheData.value.lastKnownUsername };
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

    await usernameToIdCache.set(username, { value: query || null });

    if (!query) {
      return { ok: false, status: 404, message: "unknown username" };
    }

    return { ok: true, id: query.id, username: query.lastKnownUsername };
  },
);

export const getPrivacy = query(z.string(), async (userId) => {
  userId = await getUserIdHelper(userId);

  const cache = await privacyCache.get(userId);

  if (cache !== null) {
    return cache;
  }

  const query = await prisma.preferences.findUnique({
    where: { userId },
    select: { leaderboards: true },
  });

  let isPrivate = false;

  if (query && !query.leaderboards) {
    isPrivate = true;
  }

  await privacyCache.set(userId, isPrivate);

  return isPrivate;
});

function getBaseDataFromDatabase(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      avatar: true,
      blacklisted: true,
      lastCommand: true,
      id: true,
      lastKnownUsername: true,
      birthday: true,
      birthdayAnnounce: true,
      Tags: {
        select: {
          selected: true,
          tagId: true,
        },
      },
      Premium: {
        select: {
          level: true,
          embedColor: true,
        },
      },
      Economy: {
        select: {
          prestige: true,
          level: true,
          money: true,
          netWorth: true,
          bank: true,
          dailyStreak: true,
          voteStreak: true,
          EconomyGuildMember: {
            select: {
              guildName: true,
            },
          },
        },
      },
    },
  });
}

export const getBaseData = query(z.string(), async (userId) => {
  userId = await getUserIdHelper(userId);
  await checkPrivacyHelper(userId);

  const cacheData = await baseDataCache.get(userId);

  if (cacheData !== null) {
    if (!cacheData.value) {
      error(404, "unknown user");
    }

    return cacheData.value;
  }

  const query = await getBaseDataFromDatabase(userId);

  if (!query) {
    error(404, "unknown user");
  }

  await baseDataCache.set(userId, { value: query || null });

  return query;
});

function getCommandUsesFromDatabase(userId: string) {
  return prisma.commandUse.groupBy({
    by: ["command"],
    _sum: {
      uses: true,
    },
    orderBy: {
      _sum: {
        uses: "desc",
      },
    },
    where: {
      userId,
    },
  });
}

export const getCommandUses = query(z.string(), async (userId) => {
  userId = await getUserIdHelper(userId);
  await checkPrivacyHelper(userId);

  const cacheData = await commandUsesCache.get(userId);

  if (cacheData !== null) {
    return cacheData;
  }

  const query = await getCommandUsesFromDatabase(userId);

  await commandUsesCache.set(userId, query);

  return query;
});

function getAchievementsFromDatabase(userId: string) {
  return prisma.achievements.findMany({
    where: { userId },
    select: {
      achievementId: true,
      completedAt: true,
      progress: true,
    },
  });
}

export const getAchievements = query(z.string(), async (userId) => {
  userId = await getUserIdHelper(userId);
  await checkPrivacyHelper(userId);

  const cacheData = await achievementsCache.get(userId);

  if (cacheData !== null) {
    return cacheData;
  }

  const query = await getAchievementsFromDatabase(userId);

  await achievementsCache.set(userId, query);

  return query;
});

function getInventoryFromDatabase(userId: string) {
  return prisma.inventory.findMany({
    where: { userId },
    select: { item: true, amount: true },
    orderBy: { item: "asc" },
  });
}

export const getInventory = query(z.string(), async (userId) => {
  userId = await getUserIdHelper(userId);
  await checkPrivacyHelper(userId);

  const cacheData = await inventoryCache.get(userId);

  if (cacheData !== null) {
    return cacheData;
  }

  const query = await getInventoryFromDatabase(userId);

  await inventoryCache.set(userId, query);

  return query;
});

function getMuseumFromDatabase(userId: string) {
  return prisma.museum.findMany({
    where: { userId },
    select: {
      itemId: true,
      amount: true,
      completedAt: true,
      favorited: true,
    },
    orderBy: { itemId: "asc" },
  });
}

export const getMuseum = query(z.string(), async (userId) => {
  userId = await getUserIdHelper(userId);
  await checkPrivacyHelper(userId);

  const cacheData = await museumCache.get(userId);

  if (cacheData !== null) {
    return cacheData;
  }

  const query = await getMuseumFromDatabase(userId);

  await museumCache.set(userId, query);

  return query;
});

export const getMarriagePartner = query(z.string(), async (userId) => {
  userId = await getUserIdHelper(userId);

  const cacheData = await marriagePartnerCache.get(userId);

  if (cacheData !== null) {
    return cacheData.value;
  }

  const marriage = await prisma.marriage.findUnique({
    where: { userId },
    select: { partnerId: true },
  });

  if (marriage) {
    const user = await prisma.user.findUnique({
      where: { id: marriage.partnerId },
      select: { id: true, lastKnownUsername: true },
    });

    await marriagePartnerCache.set(userId, { value: user || null });

    return user || null;
  }

  await marriagePartnerCache.set(userId, { value: null });

  return null;
});
