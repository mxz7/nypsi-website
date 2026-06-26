import { query } from "$app/server";
import { RedisCache } from "$lib/server/cache";
import prisma from "$lib/server/database";
import type { LotteryType } from "@generated/prisma";
import type { ChartConfiguration } from "chart.js";
import dayjs from "dayjs";
import { z } from "zod";

const rangeToDays = {
  "30d": 30,
  "90d": 90,
  "1y": 365,
  all: null,
} as const;

const rangeSchema = z.enum(["30d", "90d", "1y", "all"]);

export type LotteryChartRange = z.infer<typeof rangeSchema>;

const lotteryChartCache = new RedisCache<ChartConfiguration>("cache:lottery:chart", 900);

export const getLotteryWinningsChart = query(
  rangeSchema,
  async (range): Promise<ChartConfiguration> => {
    const cached = await lotteryChartCache.get(range);

    if (cached) {
      return cached;
    }

    const days = rangeToDays[range as LotteryChartRange];

    const history = await prisma.lottery.findMany({
      where: days
        ? {
            date: {
              gte: dayjs().subtract(days, "day").toDate(),
            },
          }
        : undefined,
      orderBy: {
        date: "asc",
      },
      select: {
        date: true,
        totalWin: true,
        totalTickets: true,
      },
    });

    const winningsByDate = new Map<string, number>();

    for (const draw of history) {
      const date = dayjs(draw.date).format("YYYY-MM-DD");
      const drawWinnings = Number(draw.totalWin ?? draw.totalTickets);
      const currentValue = winningsByDate.get(date) ?? 0;
      winningsByDate.set(date, currentValue + drawWinnings);
    }

    const labels = [...winningsByDate.keys()];
    const winnings = labels.map((label) => winningsByDate.get(label) ?? 0);

    const chartData: ChartConfiguration = {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "winnings",
            data: winnings,
            fill: true,
            borderColor: "#8b5cf6",
            backgroundColor: "#8b5cf633",
          },
        ],
      },
    };

    await lotteryChartCache.set(range, chartData);

    return chartData;
  },
);

const lotteryHistorySchema = z.number().int().min(1).default(1);

export type LotteryHistoryEntry = {
  id: number;
  date: Date;
  type: LotteryType;
  winnerId: string | null;
  winner:
    | {
        id: string;
        username: string;
      }
    | string;
  winnerTickets: number;
  totalTickets: number;
  totalWin: number;
};

export type LotteryHistoryResult = {
  page: number;
  totalPages: number;
  draws: LotteryHistoryEntry[];
};

const lotteryHistoryCache = new RedisCache<LotteryHistoryResult>("cache:lottery:history", 300);

export const getLotteryHistory = query(lotteryHistorySchema, async (page) => {
  const cached = await lotteryHistoryCache.get(page.toString());

  if (cached) {
    return {
      ...cached,
      draws: cached.draws.map((draw) => ({
        ...draw,
        date: new Date(draw.date),
      })),
    };
  }

  const take = 25;
  const skip = (page - 1) * take;

  const [totalCount, draws] = await prisma.$transaction([
    prisma.lottery.count(),
    prisma.lottery.findMany({
      orderBy: {
        date: "desc",
      },
      skip,
      take,
      select: {
        id: true,
        date: true,
        type: true,
        winnerId: true,
        winnerTickets: true,
        totalTickets: true,
        totalWin: true,
        winner: {
          select: {
            id: true,
            lastKnownUsername: true,
            Preferences: {
              select: {
                leaderboards: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const result: LotteryHistoryResult = {
    page,
    totalPages: Math.max(1, Math.ceil(totalCount / take)),
    draws: draws.map((draw) => {
      let winner: LotteryHistoryEntry["winner"];

      if (!draw.winner) {
        winner = "unknown";
      } else if (!draw.winner?.Preferences?.leaderboards) {
        winner = "hidden";
      } else {
        winner = {
          id: draw.winner.id,
          username: draw.winner.lastKnownUsername,
        };
      }

      return {
        id: draw.id,
        date: draw.date,
        type: draw.type,
        winnerId: draw.winnerId,
        winner: winner,
        winnerTickets: Number(draw.winnerTickets),
        totalTickets: Number(draw.totalTickets),
        totalWin: Number(draw.totalWin),
      };
    }),
  };

  await lotteryHistoryCache.set(page.toString(), result);

  return result;
});
