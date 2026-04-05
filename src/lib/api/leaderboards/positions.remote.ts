import { query } from "$app/server";
import { getAuthedUser } from "$lib/api/auth.remote";
import { RedisCache } from "$lib/server/cache";
import prisma from "$lib/server/database";
import type { LeaderboardPosition } from "$lib/types/leaderboards";
import { z } from "zod";
import { LeaderboardTypeSchema, formatTime, type LeaderboardType } from "./shared";

type CachedLeaderboardPosition = LeaderboardPosition;

const NO_POSITION: CachedLeaderboardPosition = { position: -1, value: "" };

const positionCache = new RedisCache<CachedLeaderboardPosition>("cache:leaderboard-position", 600);

function toNumber(value: number | bigint | null): number {
  if (typeof value === "bigint") return Number(value);
  return value ?? 0;
}

const knownPositionQueries: Record<
  LeaderboardType,
  (userId: string) => Promise<LeaderboardPosition | null>
> = {
  balance: async (userId) => {
    const rows = await prisma.$queryRaw<{ position: bigint; money: bigint }[]>`
      WITH ranked AS (
        SELECT "userId", money, ROW_NUMBER() OVER (ORDER BY money DESC) AS position
        FROM "Economy"
        WHERE money > 0
      )
      SELECT position, money
      FROM ranked
      WHERE "userId" = ${userId}
      LIMIT 1
    `;

    const row = rows[0];
    if (!row) return null;

    return {
      position: toNumber(row.position),
      value: `$${toNumber(row.money).toLocaleString()}`,
    };
  },

  "net-worth": async (userId) => {
    const rows = await prisma.$queryRaw<{ position: bigint; netWorth: bigint }[]>`
      WITH ranked AS (
        SELECT "userId", "netWorth", ROW_NUMBER() OVER (ORDER BY "netWorth" DESC) AS position
        FROM "Economy"
        WHERE "netWorth" > 0
      )
      SELECT position, "netWorth"
      FROM ranked
      WHERE "userId" = ${userId}
      LIMIT 1
    `;

    const row = rows[0];
    if (!row) return null;

    return {
      position: toNumber(row.position),
      value: `$${toNumber(row.netWorth).toLocaleString()}`,
    };
  },

  level: async (userId) => {
    const rows = await prisma.$queryRaw<{ position: bigint; prestige: number; level: number }[]>`
      WITH ranked AS (
        SELECT "userId", prestige, level,
        ROW_NUMBER() OVER (ORDER BY prestige DESC, level DESC) AS position
        FROM "Economy"
        WHERE prestige > 0 OR level > 0
      )
      SELECT position, prestige, level
      FROM ranked
      WHERE "userId" = ${userId}
      LIMIT 1
    `;

    const row = rows[0];
    if (!row) return null;

    return {
      position: toNumber(row.position),
      value: `P${row.prestige} L${row.level}`,
    };
  },

  guilds: async (userId) => {
    const rows = await prisma.$queryRaw<{ position: bigint; level: number }[]>`
      WITH ranked AS (
        SELECT "guildName", level,
        ROW_NUMBER() OVER (ORDER BY level DESC, xp DESC, balance DESC, "guildName" ASC) AS position
        FROM "EconomyGuild"
      )
      SELECT ranked.position, ranked.level
      FROM ranked
      INNER JOIN "EconomyGuildMember" ON "EconomyGuildMember"."guildName" = ranked."guildName"
      WHERE "EconomyGuildMember"."userId" = ${userId}
      LIMIT 1
    `;

    const row = rows[0];
    if (!row) return null;

    return {
      position: toNumber(row.position),
      value: `level ${row.level}`,
    };
  },

  streak: async (userId) => {
    const rows = await prisma.$queryRaw<{ position: bigint; dailyStreak: number }[]>`
      WITH ranked AS (
        SELECT "userId", "dailyStreak",
        ROW_NUMBER() OVER (ORDER BY "dailyStreak" DESC) AS position
        FROM "Economy"
        WHERE "dailyStreak" > 0
      )
      SELECT position, "dailyStreak"
      FROM ranked
      WHERE "userId" = ${userId}
      LIMIT 1
    `;

    const row = rows[0];
    if (!row) return null;

    return {
      position: toNumber(row.position),
      value: toNumber(row.dailyStreak).toLocaleString(),
    };
  },

  lottery: async (userId) => {
    const rows = await prisma.$queryRaw<{ position: bigint; progress: bigint }[]>`
      WITH ranked AS (
        SELECT "userId", progress,
        ROW_NUMBER() OVER (ORDER BY progress DESC) AS position
        FROM "Achievements"
        WHERE (
          (completed = false AND "achievementId" LIKE 'lucky_%')
          OR (completed = true AND "achievementId" = 'lucky_v')
        )
      )
      SELECT position, progress
      FROM ranked
      WHERE "userId" = ${userId}
      ORDER BY position ASC
      LIMIT 1
    `;

    const row = rows[0];
    if (!row) return null;

    return {
      position: toNumber(row.position),
      value: toNumber(row.progress).toLocaleString(),
    };
  },

  commands: async (userId) => {
    const rows = await prisma.$queryRaw<{ position: bigint; value: bigint }[]>`
      WITH totals AS (
        SELECT "userId", SUM(uses) AS value
        FROM "CommandUse"
        GROUP BY "userId"
      ),
      ranked AS (
        SELECT "userId", value,
        ROW_NUMBER() OVER (ORDER BY value DESC) AS position
        FROM totals
      )
      SELECT position, value
      FROM ranked
      WHERE "userId" = ${userId}
      LIMIT 1
    `;

    const row = rows[0];
    if (!row) return null;

    return {
      position: toNumber(row.position),
      value: toNumber(row.value).toLocaleString(),
    };
  },

  "vote-month": async (userId) => {
    const rows = await prisma.$queryRaw<{ position: bigint; monthVote: number }[]>`
      WITH ranked AS (
        SELECT "userId", "monthVote", "lastVote",
        ROW_NUMBER() OVER (ORDER BY "monthVote" DESC, "lastVote" ASC) AS position
        FROM "Economy"
        WHERE "monthVote" > 0 OR "seasonVote" > 0
      )
      SELECT position, "monthVote"
      FROM ranked
      WHERE "userId" = ${userId}
      LIMIT 1
    `;

    const row = rows[0];
    if (!row) return null;

    return {
      position: toNumber(row.position),
      value: `${row.monthVote}`,
    };
  },

  "vote-streak": async (userId) => {
    const rows = await prisma.$queryRaw<{ position: bigint; voteStreak: number }[]>`
      WITH ranked AS (
        SELECT "userId", "voteStreak", "monthVote",
        ROW_NUMBER() OVER (ORDER BY "voteStreak" DESC, "monthVote" DESC) AS position
        FROM "Economy"
        WHERE "voteStreak" > 0
      )
      SELECT position, "voteStreak"
      FROM ranked
      WHERE "userId" = ${userId}
      LIMIT 1
    `;

    const row = rows[0];
    if (!row) return null;

    return {
      position: toNumber(row.position),
      value: `${row.voteStreak}`,
    };
  },

  "wordle-wins": async (userId) => {
    const rows = await prisma.$queryRaw<{ position: bigint; value: bigint }[]>`
      WITH totals AS (
        SELECT "userId", COUNT(*) AS value
        FROM "WordleGame"
        WHERE won = true
        GROUP BY "userId"
      ),
      ranked AS (
        SELECT "userId", value,
        ROW_NUMBER() OVER (ORDER BY value DESC) AS position
        FROM totals
      )
      SELECT position, value
      FROM ranked
      WHERE "userId" = ${userId}
      LIMIT 1
    `;

    const row = rows[0];
    if (!row) return null;

    return {
      position: toNumber(row.position),
      value: toNumber(row.value).toLocaleString(),
    };
  },

  "wordle-time": async (userId) => {
    const rows = await prisma.$queryRaw<{ position: bigint; value: bigint }[]>`
      WITH totals AS (
        SELECT "userId", MIN(time) AS value
        FROM "WordleGame"
        WHERE won = true AND time > 0
        GROUP BY "userId"
      ),
      ranked AS (
        SELECT "userId", value,
        ROW_NUMBER() OVER (ORDER BY value ASC) AS position
        FROM totals
      )
      SELECT position, value
      FROM ranked
      WHERE "userId" = ${userId}
      LIMIT 1
    `;

    const row = rows[0];
    if (!row) return null;

    return {
      position: toNumber(row.position),
      value: formatTime(toNumber(row.value)),
    };
  },

  "chess-solved": async (userId) => {
    const rows = await prisma.$queryRaw<{ position: bigint; solved: number }[]>`
      WITH ranked AS (
        SELECT "userId", solved,
        ROW_NUMBER() OVER (ORDER BY solved DESC) AS position
        FROM "ChessPuzzleStats"
        WHERE solved > 0
      )
      SELECT position, solved
      FROM ranked
      WHERE "userId" = ${userId}
      LIMIT 1
    `;

    const row = rows[0];
    if (!row) return null;

    return {
      position: toNumber(row.position),
      value: row.solved.toLocaleString(),
    };
  },

  "chess-rating": async (userId) => {
    const rows = await prisma.$queryRaw<{ position: bigint; averageWinningRating: number }[]>`
      WITH ranked AS (
        SELECT "userId", "averageWinningRating",
        ROW_NUMBER() OVER (ORDER BY "averageWinningRating" DESC) AS position
        FROM "ChessPuzzleStats"
        WHERE "averageWinningRating" IS NOT NULL
      )
      SELECT position, "averageWinningRating"
      FROM ranked
      WHERE "userId" = ${userId}
      LIMIT 1
    `;

    const row = rows[0];
    if (!row) return null;

    return {
      position: toNumber(row.position),
      value: toNumber(row.averageWinningRating).toFixed(0),
    };
  },

  "chess-fastest": async (userId) => {
    const rows = await prisma.$queryRaw<{ position: bigint; fastestSolve: number }[]>`
      WITH ranked AS (
        SELECT "userId", "fastestSolve",
        ROW_NUMBER() OVER (ORDER BY "fastestSolve" ASC) AS position
        FROM "ChessPuzzleStats"
        WHERE "fastestSolve" IS NOT NULL
      )
      SELECT position, "fastestSolve"
      FROM ranked
      WHERE "userId" = ${userId}
      LIMIT 1
    `;

    const row = rows[0];
    if (!row) return null;

    return {
      position: toNumber(row.position),
      value: formatTime(toNumber(row.fastestSolve)),
    };
  },

  "chatreaction-daily": async (userId) => {
    const rows = await prisma.$queryRaw<{ position: bigint; time: number }[]>`
      WITH ranked AS (
        SELECT "userId", time,
        ROW_NUMBER() OVER (ORDER BY time ASC) AS position
        FROM "ChatReactionLeaderboards"
        WHERE daily = true
      )
      SELECT position, time
      FROM ranked
      WHERE "userId" = ${userId}
      LIMIT 1
    `;

    const row = rows[0];
    if (!row) return null;

    return {
      position: toNumber(row.position),
      value: formatTime(toNumber(row.time) * 1000),
    };
  },

  "chatreaction-alltime": async (userId) => {
    const rows = await prisma.$queryRaw<{ position: bigint; time: number }[]>`
      WITH ranked AS (
        SELECT "userId", time,
        ROW_NUMBER() OVER (ORDER BY time ASC) AS position
        FROM "ChatReactionLeaderboards"
        WHERE daily = false
      )
      SELECT position, time
      FROM ranked
      WHERE "userId" = ${userId}
      LIMIT 1
    `;

    const row = rows[0];
    if (!row) return null;

    return {
      position: toNumber(row.position),
      value: formatTime(toNumber(row.time) * 1000),
    };
  },

  "flag-wins": async (userId) => {
    const rows = await prisma.$queryRaw<{ position: bigint; value: bigint }[]>`
      WITH totals AS (
        SELECT "userId", COUNT(*) AS value
        FROM "FlagGame"
        WHERE won = true
        GROUP BY "userId"
      ),
      ranked AS (
        SELECT "userId", value,
        ROW_NUMBER() OVER (ORDER BY value DESC) AS position
        FROM totals
      )
      SELECT position, value
      FROM ranked
      WHERE "userId" = ${userId}
      LIMIT 1
    `;

    const row = rows[0];
    if (!row) return null;

    return {
      position: toNumber(row.position),
      value: toNumber(row.value).toLocaleString(),
    };
  },

  "flag-time": async (userId) => {
    const rows = await prisma.$queryRaw<{ position: bigint; value: bigint }[]>`
      WITH totals AS (
        SELECT "userId", MIN(time) AS value
        FROM "FlagGame"
        WHERE won = true AND time > 0
        GROUP BY "userId"
      ),
      ranked AS (
        SELECT "userId", value,
        ROW_NUMBER() OVER (ORDER BY value ASC) AS position
        FROM totals
      )
      SELECT position, value
      FROM ranked
      WHERE "userId" = ${userId}
      LIMIT 1
    `;

    const row = rows[0];
    if (!row) return null;

    return {
      position: toNumber(row.position),
      value: formatTime(toNumber(row.value)),
    };
  },
};

async function getKnownUserPositionInternal(type: LeaderboardType, userId: string) {
  const cacheKey = `${type}:${userId}`;
  const cached = await positionCache.get(cacheKey);

  if (cached) {
    if (cached.position === NO_POSITION.position) return null;
    return cached;
  }

  const result = await knownPositionQueries[type](userId);
  await positionCache.set(cacheKey, result ?? NO_POSITION);

  return result;
}

async function getItemUserPositionInternal(itemId: string, userId: string) {
  const cacheKey = `${itemId}:${userId}`;
  const cached = await positionCache.get(cacheKey);

  if (cached) {
    if (cached.position === NO_POSITION.position) return null;
    return cached;
  }

  if (itemId === "lottery_ticket") {
    await positionCache.set(cacheKey, NO_POSITION);
    return null;
  }

  const rows = await prisma.$queryRaw<{ position: bigint; amount: bigint }[]>`
    WITH ranked AS (
      SELECT "userId", amount,
      ROW_NUMBER() OVER (ORDER BY amount DESC) AS position
      FROM "Inventory"
      WHERE item = ${itemId} AND amount > 0
    )
    SELECT position, amount
    FROM ranked
    WHERE "userId" = ${userId}
    LIMIT 1
  `;

  const row = rows[0];
  if (!row) {
    await positionCache.set(cacheKey, NO_POSITION);
    return null;
  }

  const result: LeaderboardPosition = {
    position: toNumber(row.position),
    value: toNumber(row.amount).toLocaleString(),
  };

  await positionCache.set(cacheKey, result);
  return result;
}

export const getKnownUserPosition = query(LeaderboardTypeSchema, async (type) => {
  const authedUser = await getAuthedUser();
  if (!authedUser) return null;

  return getKnownUserPositionInternal(type, authedUser.id);
});

export const getItemUserPosition = query(z.string(), async (type) => {
  const authedUser = await getAuthedUser();
  if (!authedUser) return null;

  return getItemUserPositionInternal(type, authedUser.id);
});
