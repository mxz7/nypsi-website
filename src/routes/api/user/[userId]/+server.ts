import prisma from "$lib/server/database.js";
import { error, json } from "@sveltejs/kit";

export const GET = async ({ params, setHeaders }) => {
  const userId = params.userId;

  setHeaders({
    "cache-control": "max-age=600",
  });

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
          xp: true,
          Inventory: {
            select: {
              item: true,
              amount: true,
            },
          },
          EconomyGuild: {
            select: {
              guildName: true,
              level: true,
              balance: true,
              xp: true,
              members: {
                orderBy: {
                  joinedAt: "desc",
                },
                select: {
                  economy: {
                    select: {
                      user: {
                        select: {
                          lastKnownTag: true,
                          id: true,
                        },
                      },
                    },
                  },
                },
              },
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
              bet: true,
              earned: true,
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
      avatar: true,
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

  query.lastKnownTag = query.lastKnownTag.split("#")[0];

  if (query.Economy) {
    query.Economy.money = Number(query.Economy.money) as unknown as bigint;
    query.Economy.bank = Number(query.Economy.bank) as unknown as bigint;
    query.Economy.bankStorage = Number(query.Economy.bankStorage) as unknown as bigint;
    query.Economy.netWorth = Number(query.Economy.netWorth) as unknown as bigint;
    query.Economy.Inventory = query.Economy.Inventory.map((i) => {
      return { item: i.item, amount: Number(i.amount) as unknown as bigint };
    });
    if (query.Economy.EconomyGuild?.balance)
      query.Economy.EconomyGuild.balance = Number(
        query.Economy.EconomyGuild?.balance
      ) as unknown as bigint;
  }

  return json(query);
};
