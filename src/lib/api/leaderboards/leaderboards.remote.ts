import { query } from "$app/server";
import { RedisKey } from "$lib/data/constants";
import { RedisCache } from "$lib/server/cache";
import prisma from "$lib/server/database";
import type { LeaderboardData } from "$lib/types/leaderboards";
import { error } from "@sveltejs/kit";
import { z } from "zod";
import { getItemsRemote } from "../items.remote";
import { LeaderboardTypeSchema, formatTime, type LeaderboardType } from "./shared";

const cache = new RedisCache<LeaderboardData>(RedisKey.leaderboards.DATA, 600);

const leaderboardQueries: Record<LeaderboardType, () => Promise<LeaderboardData>> = {
  balance: async () => {
    return await prisma.economy
      .findMany({
        where: { money: { gt: 0 } },
        select: {
          userId: true,
          money: true,
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
        return r.map((x) => {
          count++;
          const user = x.user.lastKnownUsername.split("#")[0];
          return {
            value: `$${x.money.toLocaleString()}`,
            user: {
              username: !x.user.Preferences?.leaderboards ? user : "[hidden]",
              id: !x.user.Preferences?.leaderboards ? x.userId : undefined,
              tag: x.user.Tags.length > 0 ? x.user.Tags[0].tagId : null,
            },
            position: count,
          };
        });
      });
  },

  "net-worth": async () => {
    return await prisma.economy
      .findMany({
        where: { netWorth: { gt: 0 } },
        select: {
          userId: true,
          netWorth: true,
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
        return r.map((x) => {
          count++;
          const user = x.user.lastKnownUsername.split("#")[0];
          return {
            value: `$${x.netWorth.toLocaleString()}`,
            user: {
              username: !x.user.Preferences?.leaderboards ? user : "[hidden]",
              id: !x.user.Preferences?.leaderboards ? x.userId : undefined,
              tag: x.user.Tags.length > 0 ? x.user.Tags[0].tagId : null,
            },
            position: count,
          };
        });
      });
  },

  level: async () => {
    return await prisma.economy
      .findMany({
        where: {
          OR: [{ prestige: { gt: 0 } }, { level: { gt: 0 } }],
        },
        select: {
          userId: true,
          prestige: true,
          level: true,
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
        return r.map((x) => {
          count++;
          const user = x.user.lastKnownUsername.split("#")[0];
          return {
            value: `P${x.prestige} L${x.level}`,
            user: {
              username: !x.user.Preferences?.leaderboards ? user : "[hidden]",
              id: !x.user.Preferences?.leaderboards ? x.userId : undefined,
              tag: x.user.Tags.length > 0 ? x.user.Tags[0].tagId : null,
            },
            position: count,
          };
        });
      });
  },

  guilds: async () => {
    return await prisma.economyGuild
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
  },

  streak: async () => {
    return await prisma.economy
      .findMany({
        where: { dailyStreak: { gt: 0 } },
        select: {
          userId: true,
          dailyStreak: true,
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
        return r.map((x) => {
          count++;
          const user = x.user.lastKnownUsername.split("#")[0];
          return {
            value: `${x.dailyStreak.toLocaleString()}`,
            user: {
              username: !x.user.Preferences?.leaderboards ? user : "[hidden]",
              id: !x.user.Preferences?.leaderboards ? x.userId : undefined,
              tag: x.user.Tags.length > 0 ? x.user.Tags[0].tagId : null,
            },
            position: count,
          };
        });
      });
  },

  lottery: async () => {
    return await prisma.achievements
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
              Preferences: { select: { leaderboards: true } },
              Tags: { select: { tagId: true }, where: { selected: true } },
            },
          },
        },
        orderBy: { progress: "desc" },
        take: 100,
      })
      .then((r) => {
        let count = 0;
        return r.map((x) => {
          count++;
          const user = x.user.lastKnownUsername.split("#")[0];
          return {
            value: x.progress.toLocaleString(),
            user: {
              username: !x.user.Preferences?.leaderboards ? user : "[hidden]",
              id: !x.user.Preferences?.leaderboards ? x.userId : undefined,
              tag: x.user.Tags.length > 0 ? x.user.Tags[0].tagId : null,
            },
            position: count,
          };
        });
      });
  },

  commands: async () => {
    return await prisma.$queryRaw`select sum("CommandUse"."uses") as value, "CommandUse"."userId", "User"."lastKnownUsername", "Tags"."tagId", "Preferences"."leaderboards" from "User"
    right join "CommandUse" on "CommandUse"."userId" = "User"."id"
    left join "Tags" on "Tags"."userId" = "User"."id" and "Tags"."selected" = true
    left join "Preferences" on "Preferences"."userId" = "User"."id"
    group by "CommandUse"."userId", "User"."id", "Tags"."tagId", "Preferences"."leaderboards"
    order by "value" desc limit 100`.then(
      (
        i: {
          value: bigint;
          userId: string;
          lastKnownUsername: string;
          tagId: string;
          leaderboards: boolean;
        }[],
      ) => {
        return i.map((i, index) => ({
          value: i.value.toLocaleString(),
          position: index + 1,
          user: {
            username: !i.leaderboards ? i.lastKnownUsername : "[hidden]",
            id: !i.leaderboards ? i.userId : undefined,
            tag: !i.leaderboards ? i.tagId : undefined,
          },
        }));
      },
    );
  },

  "vote-month": async () => {
    return await prisma.economy
      .findMany({
        where: {
          OR: [{ monthVote: { gt: 0 } }, { seasonVote: { gt: 0 } }],
        },
        select: {
          userId: true,
          monthVote: true,
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
        return r.map((x) => {
          count++;
          const user = x.user.lastKnownUsername.split("#")[0];
          return {
            value: `${x.monthVote}`,
            user: {
              username: !x.user.Preferences?.leaderboards ? user : "[hidden]",
              id: !x.user.Preferences?.leaderboards ? x.userId : undefined,
              tag:
                !x.user.Preferences?.leaderboards && x.user.Tags.length > 0
                  ? x.user.Tags[0].tagId
                  : null,
            },
            position: count,
          };
        });
      });
  },

  "vote-streak": async () => {
    return await prisma.economy
      .findMany({
        where: { voteStreak: { gt: 0 } },
        select: {
          userId: true,
          voteStreak: true,
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
        return r.map((x) => {
          count++;
          const user = x.user.lastKnownUsername.split("#")[0];
          return {
            value: `${x.voteStreak}`,
            user: {
              username: !x.user.Preferences?.leaderboards ? user : "[hidden]",
              id: !x.user.Preferences?.leaderboards ? x.userId : undefined,
              tag:
                !x.user.Preferences?.leaderboards && x.user.Tags.length > 0
                  ? x.user.Tags[0].tagId
                  : null,
            },
            position: count,
          };
        });
      });
  },

  "wordle-wins": async () => {
    return await prisma.$queryRaw`select "User"."id" as "userId", count(*) as value, "User"."lastKnownUsername", "Tags"."tagId", "Preferences"."leaderboards" as "privacy" from "User"
    right join "WordleGame" on "WordleGame"."userId" = "User"."id"
    left join "Tags" on "Tags"."userId" = "User"."id" and "Tags"."selected" = true
    left join "Preferences" on "Preferences"."userId" = "User"."id"
    where "WordleGame"."won" = true
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
            username: !i.privacy ? i.lastKnownUsername : "[hidden]",
            id: !i.privacy ? i.userId : undefined,
            tag: !i.privacy ? i.tagId : undefined,
          },
        }));
      },
    );
  },

  "wordle-time": async () => {
    return await prisma.$queryRaw`select "User"."id" as "userId", min("WordleGame"."time") as value, "User"."lastKnownUsername", "Tags"."tagId", "Preferences"."leaderboards" as "privacy" from "User"
    right join "WordleGame" on "WordleGame"."userId" = "User"."id"
    left join "Tags" on "Tags"."userId" = "User"."id" and "Tags"."selected" = true
    left join "Preferences" on "Preferences"."userId" = "User"."id"
    where "WordleGame"."won" = true and "WordleGame"."time" > 0
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
            username: !i.privacy ? i.lastKnownUsername : "[hidden]",
            id: !i.privacy ? i.userId : undefined,
            tag: !i.privacy ? i.tagId : undefined,
          },
        }));
      },
    );
  },

  "chess-solved": async () => {
    return await prisma.chessPuzzleStats
      .findMany({
        where: { solved: { gt: 0 } },
        select: {
          userId: true,
          solved: true,
          user: {
            select: {
              Tags: { where: { selected: true }, select: { tagId: true } },
              Preferences: { select: { leaderboards: true } },
              lastKnownUsername: true,
            },
          },
        },
        orderBy: { solved: "desc" },
        take: 100,
      })
      .then((r) => {
        let count = 0;
        return r.map((x) => {
          count++;
          const user = x.user.lastKnownUsername.split("#")[0];
          return {
            value: x.solved.toLocaleString(),
            user: {
              username: !x.user.Preferences?.leaderboards ? user : "[hidden]",
              id: !x.user.Preferences?.leaderboards ? x.userId : undefined,
              tag:
                !x.user.Preferences?.leaderboards && x.user.Tags.length > 0
                  ? x.user.Tags[0].tagId
                  : null,
            },
            position: count,
          };
        });
      });
  },

  "chess-rating": async () => {
    return await prisma.chessPuzzleStats
      .findMany({
        where: { averageWinningRating: { not: null } },
        select: {
          userId: true,
          averageWinningRating: true,
          user: {
            select: {
              Tags: { where: { selected: true }, select: { tagId: true } },
              Preferences: { select: { leaderboards: true } },
              lastKnownUsername: true,
            },
          },
        },
        orderBy: { averageWinningRating: "desc" },
        take: 100,
      })
      .then((r) => {
        let count = 0;
        return r.map((x) => {
          count++;
          const user = x.user.lastKnownUsername.split("#")[0];
          return {
            value: (x.averageWinningRating ?? 0).toFixed(0),
            user: {
              username: !x.user.Preferences?.leaderboards ? user : "[hidden]",
              id: !x.user.Preferences?.leaderboards ? x.userId : undefined,
              tag:
                !x.user.Preferences?.leaderboards && x.user.Tags.length > 0
                  ? x.user.Tags[0].tagId
                  : null,
            },
            position: count,
          };
        });
      });
  },

  "chess-fastest": async () => {
    return await prisma.chessPuzzleStats
      .findMany({
        where: { fastestSolve: { not: null } },
        select: {
          userId: true,
          fastestSolve: true,
          user: {
            select: {
              Tags: { where: { selected: true }, select: { tagId: true } },
              Preferences: { select: { leaderboards: true } },
              lastKnownUsername: true,
            },
          },
        },
        orderBy: { fastestSolve: "asc" },
        take: 100,
      })
      .then((r) => {
        let count = 0;
        return r.map((x) => {
          count++;
          const user = x.user.lastKnownUsername.split("#")[0];
          return {
            value: formatTime(x.fastestSolve ?? 0),
            user: {
              username: !x.user.Preferences?.leaderboards ? user : "[hidden]",
              id: !x.user.Preferences?.leaderboards ? x.userId : undefined,
              tag:
                !x.user.Preferences?.leaderboards && x.user.Tags.length > 0
                  ? x.user.Tags[0].tagId
                  : null,
            },
            position: count,
          };
        });
      });
  },

  "chatreaction-daily": async () => {
    return await prisma.chatReactionLeaderboards
      .findMany({
        where: { daily: true },
        select: {
          userId: true,
          time: true,
          user: {
            select: {
              Tags: { where: { selected: true }, select: { tagId: true } },
              Preferences: { select: { leaderboards: true } },
              lastKnownUsername: true,
            },
          },
        },
        orderBy: { time: "asc" },
        take: 100,
      })
      .then((r) => {
        let count = 0;
        return r.map((x) => {
          count++;
          const user = x.user.lastKnownUsername.split("#")[0];
          return {
            value: formatTime(x.time * 1000),
            user: {
              username: !x.user.Preferences?.leaderboards ? user : "[hidden]",
              id: !x.user.Preferences?.leaderboards ? x.userId : undefined,
              tag:
                !x.user.Preferences?.leaderboards && x.user.Tags.length > 0
                  ? x.user.Tags[0].tagId
                  : null,
            },
            position: count,
          };
        });
      });
  },

  "flag-wins": async () => {
    return await prisma.$queryRaw`select "User"."id" as "userId", count(*) as value, "User"."lastKnownUsername", "Tags"."tagId", "Preferences"."leaderboards" as "privacy" from "User"
    right join "FlagGame" on "FlagGame"."userId" = "User"."id"
    left join "Tags" on "Tags"."userId" = "User"."id" and "Tags"."selected" = true
    left join "Preferences" on "Preferences"."userId" = "User"."id"
    where "FlagGame"."won" = true
    group by "FlagGame"."userId", "User"."id", "Tags"."tagId", "Preferences"."leaderboards"
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
            username: !i.privacy ? i.lastKnownUsername : "[hidden]",
            id: !i.privacy ? i.userId : undefined,
            tag: !i.privacy ? i.tagId : undefined,
          },
        }));
      },
    );
  },

  "flag-time": async () => {
    return await prisma.$queryRaw`select "User"."id" as "userId", min("FlagGame"."time") as value, "User"."lastKnownUsername", "Tags"."tagId", "Preferences"."leaderboards" as "privacy" from "User"
    right join "FlagGame" on "FlagGame"."userId" = "User"."id"
    left join "Tags" on "Tags"."userId" = "User"."id" and "Tags"."selected" = true
    left join "Preferences" on "Preferences"."userId" = "User"."id"
    where "FlagGame"."won" = true and "FlagGame"."time" > 0
    group by "FlagGame"."userId", "User"."id", "Tags"."tagId", "Preferences"."leaderboards"
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
            username: !i.privacy ? i.lastKnownUsername : "[hidden]",
            id: !i.privacy ? i.userId : undefined,
            tag: !i.privacy ? i.tagId : undefined,
          },
        }));
      },
    );
  },

  "chatreaction-alltime": async () => {
    return await prisma.chatReactionLeaderboards
      .findMany({
        where: { daily: false },
        select: {
          userId: true,
          time: true,
          user: {
            select: {
              Tags: { where: { selected: true }, select: { tagId: true } },
              Preferences: { select: { leaderboards: true } },
              lastKnownUsername: true,
            },
          },
        },
        orderBy: { time: "asc" },
        take: 100,
      })
      .then((r) => {
        let count = 0;
        return r.map((x) => {
          count++;
          const user = x.user.lastKnownUsername.split("#")[0];
          return {
            value: formatTime(x.time * 1000),
            user: {
              username: !x.user.Preferences?.leaderboards ? user : "[hidden]",
              id: !x.user.Preferences?.leaderboards ? x.userId : undefined,
              tag:
                !x.user.Preferences?.leaderboards && x.user.Tags.length > 0
                  ? x.user.Tags[0].tagId
                  : null,
            },
            position: count,
          };
        });
      });
  },
};

export const getLeaderboard = query(LeaderboardTypeSchema, async (type) => {
  const cached = await cache.get(type);
  if (cached) return cached;

  const result = await leaderboardQueries[type]();

  await cache.set(type, result);
  return result;
});

export const getItemLeaderboard = query(z.string(), async (itemId) => {
  const key = `item:${itemId}`;
  const cached = await cache.get(key);
  if (cached) return cached;

  if (itemId === "lottery_ticket") {
    const empty: LeaderboardData = [];
    await cache.set(key, empty);
    return empty;
  }

  const result = await prisma.inventory
    .findMany({
      where: {
        AND: [{ item: itemId }, { amount: { gt: 0 } }],
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
          },
        },
      },
      orderBy: { amount: "desc" },
      take: 100,
    })
    .then((r) => {
      let count = 0;
      return r.map((x) => {
        count++;
        const user = x.economy.user.lastKnownUsername.split("#")[0];
        return {
          value: `${x.amount.toLocaleString()}`,
          user: {
            username: !x.economy.user.Preferences?.leaderboards ? user : "[hidden]",
            id: !x.economy.user.Preferences?.leaderboards ? x.userId : undefined,
            tag:
              !x.economy.user.Preferences?.leaderboards && x.economy.user.Tags.length > 0
                ? x.economy.user.Tags[0].tagId
                : null,
          },
          position: count,
        };
      });
    });

  await cache.set(key, result);
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
  "vote-month": { title: "votes this month" },
  "vote-streak": { title: "vote streak" },
  "wordle-wins": { title: "wordle wins", descriptor: "wins" },
  "wordle-time": { title: "wordle fastest wins" },
  "chess-solved": { title: "chess puzzles solved", descriptor: "solved" },
  "chess-rating": { title: "chess average rating", descriptor: "rating" },
  "chess-fastest": { title: "chess fastest solve" },
  "chatreaction-daily": { title: "chat reactions daily fastest" },
  "chatreaction-alltime": { title: "chat reactions all time fastest" },
  "flag-wins": { title: "guess the flag wins", descriptor: "wins" },
  "flag-time": { title: "guess the flag fastest wins" },
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
  const items = await getItemsRemote();
  const item = items.find((i) => i.id === type);

  if (item) {
    return {
      typeKind: "item" as const,
      itemId: item.id,
      title: `top ${item.name}`,
      descriptor: item.name,
      descriptorPlural: item.plural || item.name + "s",
    };
  }

  // Unknown type
  error(404, "unknown leaderboard");
});
