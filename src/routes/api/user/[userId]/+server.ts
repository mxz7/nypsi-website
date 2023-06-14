import prisma from "$lib/server/database.js";
import { error, json } from "@sveltejs/kit";
import dayjs from "dayjs";

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
      lastCommand: true,
      Achievements: {
        where: {
          completed: true,
        },
        select: {
          achievementId: true,
        },
      },
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
          EconomyGuildMember: {
            select: {
              guild: {
                select: {
                  guildName: true,
                  level: true,
                  balance: true,
                  xp: true,
                  members: {
                    orderBy: {
                      joinedAt: "asc",
                    },
                    select: {
                      joinedAt: true,
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
            },
          },
          Game: {
            orderBy: {
              date: "desc",
            },
            take: 15,
            select: {
              game: true,
              win: true,
              id: true,
              date: true,
              bet: true,
              earned: true,
            },
            where: {
              date: { gte: dayjs().subtract(1, "week").toDate() },
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
    if (query.Economy.EconomyGuildMember?.guild)
      query.Economy.EconomyGuildMember.guild.balance = Number(
        query.Economy.EconomyGuildMember.guild?.balance
      ) as unknown as bigint;
    query.Economy.Game = query.Economy.Game.map((g) => {
      return {
        id: g.id,
        win: g.win,
        bet: Number(g.bet) as unknown as bigint,
        earned: Number(g.earned) as unknown as bigint,
        date: g.date,
        game: g.game,
      };
    });
  }

  return json(query);
};
