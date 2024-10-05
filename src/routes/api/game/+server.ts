import prisma from "$lib/server/database.js";
import type { Prisma } from "@prisma/client";
import { error, json } from "@sveltejs/kit";

export async function GET({ url, setHeaders }) {
  setHeaders({ "cache-control": "public, max-age=600" });

  const userId = url.searchParams.get("user");
  const game = url.searchParams.get("game");
  const before = url.searchParams.get("before");
  const after = url.searchParams.get("after");
  const id = url.searchParams.get("id");
  let take = url.searchParams.get("take");
  let skip = url.searchParams.get("skip");

  const options: Prisma.GameFindManyArgs = {
    take: 1,
    where: { AND: [] },
    select: {
      bet: true,
      date: true,
      earned: true,
      game: true,
      id: true,
      win: true,
      xpEarned: true,
      outcome: true,
      userId: true,
      economy: {
        select: {
          user: {
            select: { lastKnownUsername: true, Preferences: { select: { leaderboards: true } } },
          },
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  };

  if (userId) {
    if (!userId.match(/^\d{17,19}$/)) return error(400, { message: "invalid user id" });
    (options.where.AND as Prisma.GameWhereInput[]).push({ userId });
  }

  if (game) (options.where.AND as Prisma.GameWhereInput[]).push({ game });

  if (before) {
    try {
      new Date(Number(before));
    } catch {
      return error(400, { message: "invalid before date value" });
    }
    (options.where.AND as Prisma.GameWhereInput[]).push({ date: { lt: new Date(Number(before)) } });
  }

  if (after) {
    try {
      new Date(Number(after));
    } catch {
      return error(400, { message: "invalid after date value" });
    }
    (options.where.AND as Prisma.GameWhereInput[]).push({ date: { gt: new Date(Number(after)) } });
  }

  if (take) {
    if (!Number(take)) return error(400, "invalid amount to take");
    if (Number(take) > 100) take = "100";
    if (Number(take) < 1) take = "1";

    options.take = Number(take);
  }

  if (skip) {
    if (!Number(skip)) return error(400, "invalid amount to skip");

    if (Number(skip) < 1) skip = "0";

    options.skip = Number(skip);
  }

  if (id) {
    (options.where.AND as Prisma.GameWhereInput[]).push({ id: parseInt(id, 36) });
  }

  const query: {
    bet: bigint;
    date: Date;
    earned: bigint;
    game: string;
    id: number;
    win: number;
    xpEarned: number;
    outcome: string;
    userId: string;
    economy?: {
      user?: {
        lastKnownUsername: string;
        Preferences: { leaderboards: boolean };
      };
    };
  }[] = await prisma.game.findMany(options);

  return json({
    ok: true,
    games: query.map((game) => {
      return {
        ok: true,
        bet: Number(game.bet),
        date: game.date.getTime(),
        earned: Number(game.earned),
        game: game.game,
        id: game.id,
        outcome: game.outcome,
        userId: game.userId,
        username: game.economy?.user?.Preferences.leaderboards
          ? game.economy?.user?.lastKnownUsername
          : "[hidden]",
        win: game.win,
        xpEarned: game.xpEarned,
      };
    }),
  });
}
