import prisma from "$lib/server/database.js";
import { error, json } from "@sveltejs/kit";

export const GET = async ({ params }) => {
  const userId = params.userId;

  if (!userId.match(/^\d{17,19}$/)) throw error(400, { message: "invalid user id" });

  const privacyCheck = await prisma.preferences.findUnique({
    where: {
      userId: userId,
    },
    select: {
      leaderboards: true,
    },
  });

  if (!privacyCheck) throw error(404, { message: "user not found" });

  if (!privacyCheck.leaderboards) throw error(403, { message: "user has a private profile" });

  const query = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      CommandUse: {
        select: {
          command: true,
          uses: true,
        },
        orderBy: {
          uses: "desc",
        },
        take: 1,
      },
      blacklisted: true,
      Economy: {
        select: {
          BakeryUpgrade: {
            select: {
              amount: true,
              upgradeId: true,
            },
          },
          bank: true,
          bankStorage: true,
          banned: true,
          dailyStreak: true,
          EconomyGuild: {
            select: {
              guildName: true,
              level: true,
            },
          },
          Game: {
            orderBy: {
              date: "desc",
            },
            take: 5,
            select: {
              game: true,
              win: true,
              id: true,
              date: true,
            },
          },
          money: true,
          netWorth: true,
          prestige: true,
        },
      },
      Premium: {
        select: {
          level: true,
        },
      },
      lastKnownTag: true,
      WordleStats: {
        select: {
          history: true,
          lose: true,
          win1: true,
          win2: true,
          win4: true,
          win5: true,
          win3: true,
          win6: true,
        },
      },
    },
  });

  if (!query) throw error(404, { message: "user not found" });

  if (query.Economy) {
    query.Economy.money = Number(query.Economy.money) as unknown as bigint;
    query.Economy.bank = Number(query.Economy.bank) as unknown as bigint;
    query.Economy.bankStorage = Number(query.Economy.bankStorage) as unknown as bigint;
    query.Economy.netWorth = Number(query.Economy.netWorth) as unknown as bigint;
  }

  return json(query);
};
