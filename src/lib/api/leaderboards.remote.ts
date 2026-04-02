import { query } from "$app/server";
import { RedisCache } from "$lib/server/cache";
import prisma from "$lib/server/database";
import type { LeaderboardData } from "$lib/types/LeaderboardData";
import { error } from "@sveltejs/kit";
import { z } from "zod";

const LeaderboardTypeSchema = z.enum([
  "balance",
  "net-worth",
  "level",
  "guilds",
  "streak",
  "lottery",
  "commands",
  "vote-month",
  "vote-streak",
  "wordle-wins",
  "wordle-time",
]);

export type LeaderboardType = z.infer<typeof LeaderboardTypeSchema>;

const cache = new RedisCache<LeaderboardData>("cache:leaderboard", 600);
const itemCache = new RedisCache<LeaderboardData>("cache:leaderboard:item", 600);

function formatTime(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  let seconds = ((ms % 60000) / 1000).toFixed(2);
  if (minutes > 0) {
    seconds = Math.round((ms % 60000) / 1000).toString();
  }
  return `${minutes > 0 ? `${minutes}m` : ""}${seconds}s`;
}

export const getLeaderboard = query(LeaderboardTypeSchema, async (type) => {
  const cached = await cache.get(type);
  if (cached) return cached;

  let result: LeaderboardData;

  if (type === "balance") {
    result = await prisma.economy
      .findMany({
        where: { AND: [{ money: { gt: 0 } }, { user: { blacklisted: false } }] },
        select: {
          userId: true,
          money: true,
          banned: true,
          user: {
            select: {
              Tags: { where: { selected: true }, select: { tagId: true } },
              Preferences: { select: { leaderboards: true } },
              lastKnownUsername: true,
            },
          },
        },
        orderBy: { money: "desc" },
        take: 100,
      })
      .then((r) => {
        let count = 0;
        r.forEach((user) => {
          if (user.banned && user.banned.getTime() > Date.now()) r.splice(r.indexOf(user), 1);
        });
        return r.map((x) => {
          count++;
          const user = x.user.lastKnownUsername.split("#")[0];
          return {
            value: `$${x.money.toLocaleString()}`,
            user: {
              username: x.user.Preferences?.leaderboards ? user : "[hidden]",
              id: x.user.Preferences?.leaderboards ? x.userId : undefined,
              tag: x.user.Tags.length > 0 ? x.user.Tags[0].tagId : null,
            },
            position: count,
          };
        });
      });
  } else if (type === "net-worth") {
    result = await prisma.economy
      .findMany({
        where: { AND: [{ netWorth: { gt: 0 } }, { user: { blacklisted: false } }] },
        select: {
          userId: true,
          netWorth: true,
          banned: true,
          user: {
            select: {
              Tags: { where: { selected: true }, select: { tagId: true } },
              Preferences: { select: { leaderboards: true } },
              lastKnownUsername: true,
            },
          },
        },
        orderBy: { netWorth: "desc" },
        take: 100,
      })
      .then((r) => {
        let count = 0;
        r.forEach((user) => {
          if (user.banned && user.banned.getTime() > Date.now()) r.splice(r.indexOf(user), 1);
        });
        return r.map((x) => {
          count++;
          const user = x.user.lastKnownUsername.split("#")[0];
          return {
            value: `$${x.netWorth.toLocaleString()}`,
            user: {
              username: x.user.Preferences?.leaderboards ? user : "[hidden]",
              id: x.user.Preferences?.leaderboards ? x.userId : undefined,
              tag: x.user.Tags.length > 0 ? x.user.Tags[0].tagId : null,
            },
            position: count,
          };
        });
      });
  } else if (type === "level") {
    result = await prisma.economy
      .findMany({
        where: {
          AND: [
            { OR: [{ prestige: { gt: 0 } }, { level: { gt: 0 } }] },
            { user: { blacklisted: false } },
          ],
        },
        select: {
          userId: true,
          prestige: true,
          level: true,
          banned: true,
          user: {
            select: {
              Tags: { where: { selected: true }, select: { tagId: true } },
              Preferences: { select: { leaderboards: true } },
              lastKnownUsername: true,
            },
          },
        },
        orderBy: [{ prestige: "desc" }, { level: "desc" }],
        take: 100,
      })
      .then((r) => {
        let count = 0;
        r.forEach((user) => {
          if (user.banned && user.banned.getTime() > Date.now()) r.splice(r.indexOf(user), 1);
        });
        return r.map((x) => {
          count++;
          const user = x.user.lastKnownUsername.split("#")[0];
          return {
            value: `P${x.prestige} L${x.level}`,
            user: {
              username: x.user.Preferences?.leaderboards ? user : "[hidden]",
              id: x.user.Preferences?.leaderboards ? x.userId : undefined,
              tag: x.user.Tags.length > 0 ? x.user.Tags[0].tagId : null,
            },
            position: count,
          };
        });
      });
  } else if (type === "guilds") {
    result = await prisma.economyGuild
      .findMany({
        select: { guildName: true, level: true },
        orderBy: [{ level: "desc" }, { xp: "desc" }, { balance: "desc" }, { guildName: "asc" }],
        take: 100,
      })
      .then((r) => {
        let count = 0;
        return r.map((x) => {
          count++;
          return {
            value: `level ${x.level}`,
            user: { username: x.guildName, id: x.guildName },
            position: count,
          };
        });
      });
  } else if (type === "streak") {
    result = await prisma.economy
      .findMany({
        where: { AND: [{ dailyStreak: { gt: 0 } }, { user: { blacklisted: false } }] },
        select: {
          userId: true,
          dailyStreak: true,
          banned: true,
          user: {
            select: {
              Tags: { where: { selected: true }, select: { tagId: true } },
              Preferences: { select: { leaderboards: true } },
              lastKnownUsername: true,
            },
          },
        },
        orderBy: { dailyStreak: "desc" },
        take: 100,
      })
      .then((r) => {
        let count = 0;
        r.forEach((user) => {
          if (user.banned && user.banned.getTime() > Date.now()) r.splice(r.indexOf(user), 1);
        });
        return r.map((x) => {
          count++;
          const user = x.user.lastKnownUsername.split("#")[0];
          return {
            value: `${x.dailyStreak.toLocaleString()}`,
            user: {
              username: x.user.Preferences?.leaderboards ? user : "[hidden]",
              id: x.user.Preferences?.leaderboards ? x.userId : undefined,
              tag: x.user.Tags.length > 0 ? x.user.Tags[0].tagId : null,
            },
            position: count,
          };
        });
      });
  } else if (type === "lottery") {
    result = await prisma.achievements
      .findMany({
        where: {
          OR: [
            { AND: [{ completed: false }, { achievementId: { startsWith: "lucky_" } }] },
            { AND: [{ completed: true }, { achievementId: { equals: "lucky_v" } }] },
          ],
        },
        select: {
          userId: true,
          progress: true,
          user: {
            select: {
              id: true,
              lastKnownUsername: true,
              blacklisted: true,
              Preferences: { select: { leaderboards: true } },
              Tags: { select: { tagId: true }, where: { selected: true } },
              Economy: { select: { banned: true } },
            },
          },
        },
        orderBy: { progress: "desc" },
        take: 100,
      })
      .then((r) => {
        const filtered = r.filter((i) => {
          if (!i.user.blacklisted && !i.user?.Economy?.banned) return true;
          if (i.user.blacklisted) return false;
          if (i.user.Economy.banned && i.user.Economy.banned.getTime() > Date.now()) return false;
          return true;
        });
        let count = 0;
        return filtered.map((x) => {
          count++;
          const user = x.user.lastKnownUsername.split("#")[0];
          return {
            value: x.progress.toLocaleString(),
            user: {
              username: x.user.Preferences?.leaderboards ? user : "[hidden]",
              id: x.user.Preferences?.leaderboards ? x.userId : undefined,
              tag: x.user.Tags.length > 0 ? x.user.Tags[0].tagId : null,
            },
            position: count,
          };
        });
      });
  } else if (type === "commands") {
    result =
      await prisma.$queryRaw`select sum("CommandUse"."uses") as value, "CommandUse"."userId", "User"."lastKnownUsername", "Economy"."banned", "Tags"."tagId", "Preferences"."leaderboards" from "User"
    right join "CommandUse" on "CommandUse"."userId" = "User"."id"
    left join "Economy" on "Economy"."userId" = "User"."id"
    left join "Tags" on "Tags"."userId" = "User"."id" and "Tags"."selected" = true
    left join "Preferences" on "Preferences"."userId" = "User"."id"
    where "User"."blacklisted" = false
    group by "CommandUse"."userId", "User"."id", "Economy"."userId", "Tags"."tagId", "Preferences"."leaderboards"
    order by "value" desc limit 100`.then(
        (
          i: {
            value: bigint;
            userId: string;
            lastKnownUsername: string;
            banned: Date;
            tagId: string;
            leaderboards: boolean;
          }[],
        ) => {
          return i
            .filter((i) => (i.banned ? Date.now() > i.banned.getTime() : true))
            .map((i, index) => ({
              value: i.value.toLocaleString(),
              position: index + 1,
              user: {
                username: i.leaderboards ? i.lastKnownUsername : "[hidden]",
                id: i.leaderboards ? i.userId : undefined,
                tag: i.leaderboards ? i.tagId : undefined,
              },
            }));
        },
      );
  } else if (type === "vote-month") {
    result = await prisma.economy
      .findMany({
        where: {
          AND: [
            { OR: [{ monthVote: { gt: 0 } }, { seasonVote: { gt: 0 } }] },
            { user: { blacklisted: false } },
          ],
        },
        select: {
          userId: true,
          monthVote: true,
          banned: true,
          user: {
            select: {
              Tags: { where: { selected: true }, select: { tagId: true } },
              Preferences: { select: { leaderboards: true } },
              lastKnownUsername: true,
            },
          },
        },
        orderBy: [{ monthVote: "desc" }, { lastVote: "asc" }],
        take: 100,
      })
      .then((r) => {
        let count = 0;
        r.forEach((user) => {
          if (user.banned && user.banned.getTime() > Date.now()) r.splice(r.indexOf(user), 1);
        });
        return r.map((x) => {
          count++;
          const user = x.user.lastKnownUsername.split("#")[0];
          return {
            value: `${x.monthVote}`,
            user: {
              username: x.user.Preferences?.leaderboards ? user : "[hidden]",
              id: x.user.Preferences?.leaderboards ? x.userId : undefined,
              tag: x.user.Tags.length > 0 ? x.user.Tags[0].tagId : null,
            },
            position: count,
          };
        });
      });
  } else if (type === "vote-streak") {
    result = await prisma.economy
      .findMany({
        where: { AND: [{ voteStreak: { gt: 0 } }, { user: { blacklisted: false } }] },
        select: {
          userId: true,
          voteStreak: true,
          banned: true,
          user: {
            select: {
              Tags: { where: { selected: true }, select: { tagId: true } },
              Preferences: { select: { leaderboards: true } },
              lastKnownUsername: true,
            },
          },
        },
        orderBy: [{ voteStreak: "desc" }, { monthVote: "desc" }],
        take: 100,
      })
      .then((r) => {
        let count = 0;
        r.forEach((user) => {
          if (user.banned && user.banned.getTime() > Date.now()) r.splice(r.indexOf(user), 1);
        });
        return r.map((x) => {
          count++;
          const user = x.user.lastKnownUsername.split("#")[0];
          return {
            value: `${x.voteStreak}`,
            user: {
              username: x.user.Preferences?.leaderboards ? user : "[hidden]",
              id: x.user.Preferences?.leaderboards ? x.userId : undefined,
              tag: x.user.Tags.length > 0 ? x.user.Tags[0].tagId : null,
            },
            position: count,
          };
        });
      });
  } else if (type === "wordle-wins") {
    result =
      await prisma.$queryRaw`select "User"."id" as "userId", count(*) as value, "User"."lastKnownUsername", "Tags"."tagId", "Preferences"."leaderboards" as "privacy" from "User"
    right join "WordleGame" on "WordleGame"."userId" = "User"."id"
    left join "Tags" on "Tags"."userId" = "User"."id" and "Tags"."selected" = true
    left join "Preferences" on "Preferences"."userId" = "User"."id"
    where "WordleGame"."won" = true and "User"."blacklisted" = false
    group by "WordleGame"."userId", "User"."id", "Tags"."tagId", "Preferences"."leaderboards"
    order by "value" desc limit 100`.then(
        (
          i: {
            value: bigint;
            userId: string;
            lastKnownUsername: string;
            tagId: string;
            privacy: boolean;
          }[],
        ) => {
          return i.map((i, index) => ({
            value: i.value.toLocaleString(),
            position: index + 1,
            user: {
              username: i.privacy ? i.lastKnownUsername : "[hidden]",
              id: i.privacy ? i.userId : undefined,
              tag: i.privacy ? i.tagId : undefined,
            },
          }));
        },
      );
  } else {
    // wordle-time
    result =
      await prisma.$queryRaw`select "User"."id" as "userId", min("WordleGame"."time") as value, "User"."lastKnownUsername", "Tags"."tagId", "Preferences"."leaderboards" as "privacy" from "User"
    right join "WordleGame" on "WordleGame"."userId" = "User"."id"
    left join "Tags" on "Tags"."userId" = "User"."id" and "Tags"."selected" = true
    left join "Preferences" on "Preferences"."userId" = "User"."id"
    where "WordleGame"."won" = true and "User"."blacklisted" = false and "WordleGame"."time" > 0
    group by "WordleGame"."userId", "User"."id", "Tags"."tagId", "Preferences"."leaderboards"
    order by "value" asc limit 100`.then(
        (
          i: {
            value: bigint;
            userId: string;
            lastKnownUsername: string;
            tagId: string;
            privacy: boolean;
          }[],
        ) => {
          return i.map((i, index) => ({
            value: formatTime(Number(i.value)),
            position: index + 1,
            user: {
              username: i.privacy ? i.lastKnownUsername : "[hidden]",
              id: i.privacy ? i.userId : undefined,
              tag: i.privacy ? i.tagId : undefined,
            },
          }));
        },
      );
  }

  await cache.set(type, result);
  return result;
});

export const getItemLeaderboard = query(z.string(), async (itemId) => {
  const cached = await itemCache.get(itemId);
  if (cached) return cached;

  if (itemId === "lottery_ticket") {
    const empty: LeaderboardData = [];
    await itemCache.set(itemId, empty);
    return empty;
  }

  const result = await prisma.inventory
    .findMany({
      where: {
        AND: [
          { item: itemId },
          { amount: { gt: 0 } },
          { economy: { user: { blacklisted: false } } },
        ],
      },
      select: {
        userId: true,
        amount: true,
        economy: {
          select: {
            user: {
              select: {
                Tags: { where: { selected: true }, select: { tagId: true } },
                Preferences: { select: { leaderboards: true } },
                lastKnownUsername: true,
              },
            },
            banned: true,
          },
        },
      },
      orderBy: { amount: "desc" },
      take: 100,
    })
    .then((r) => {
      let count = 0;
      r.forEach((user) => {
        if (user.economy.banned && user.economy.banned.getTime() > Date.now())
          r.splice(r.indexOf(user), 1);
      });
      return r.map((x) => {
        count++;
        const user = x.economy.user.lastKnownUsername.split("#")[0];
        return {
          value: `${x.amount.toLocaleString()}`,
          user: {
            username: x.economy.user.Preferences?.leaderboards ? user : "[hidden]",
            id: x.economy.user.Preferences?.leaderboards ? x.userId : undefined,
            tag: x.economy.user.Tags.length > 0 ? x.economy.user.Tags[0].tagId : null,
          },
          position: count,
        };
      });
    });

  await itemCache.set(itemId, result);
  return result;
});

const knownTypes: Record<string, { title: string; descriptor?: string }> = {
  balance: { title: "top balance" },
  "net-worth": { title: "top net worth" },
  level: { title: "top level" },
  guilds: { title: "top guilds" },
  streak: { title: "top daily streak" },
  lottery: { title: "top lottery wins", descriptor: "wins" },
  commands: { title: "top command uses", descriptor: "uses" },
};

export const getLeaderboardMetadata = query(z.string(), async (type) => {
  // Check if known type
  if (type in knownTypes) {
    return {
      typeKind: "known" as const,
      ...knownTypes[type],
    };
  }

  // Check if item type
  const { getItemsRemote } = await import("./items.remote");
  const items = await getItemsRemote();
  const item = items.find((i) => i.id === type);

  if (item) {
    return {
      typeKind: "item" as const,
      itemId: item.id,
      title: `top ${item.name}`,
      descriptor: item.plural || `${item.name}s`,
    };
  }

  // Unknown type
  error(404, "unknown leaderboard");
});
