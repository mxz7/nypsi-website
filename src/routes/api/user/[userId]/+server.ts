import prisma from "$lib/server/database.js";
import { privacyCheck } from "$lib/server/functions/user/privacy.js";
import { error, json } from "@sveltejs/kit";

export const GET = async ({ params, setHeaders, fetch }) => {
  const userId = params.userId;

  setHeaders({
    "cache-control": "public, max-age=600, must-revalidate",
  });

  if (!userId.match(/^\d{17,19}$/)) return error(400, { message: "invalid user id" });

  const cont = await privacyCheck(userId, fetch);
  if (cont !== "continue") throw cont;

  const query = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      Tags: {
        select: {
          selected: true,
          tagId: true,
        },
      },
      Leaderboards: {
        select: {
          position: true,
          leaderboard: true,
        },
      },
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
                              lastKnownUsername: true,
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
          money: true,
          netWorth: true,
          prestige: true,
          level: true,
        },
      },
      Premium: {
        select: {
          level: true,
        },
      },
      lastKnownUsername: true,
      avatar: true,
    },
  });

  if (!query) return error(404, { message: "user not found" });

  query.lastKnownUsername = query.lastKnownUsername.split("#")[0];

  if (query.Economy) {
    query.Economy.money = Number(query.Economy.money) as unknown as bigint;
    query.Economy.bank = Number(query.Economy.bank) as unknown as bigint;
    query.Economy.bankStorage = Number(query.Economy.bankStorage) as unknown as bigint;
    query.Economy.netWorth = Number(query.Economy.netWorth) as unknown as bigint;
    query.Economy.xp = Number(query.Economy.xp) as unknown as bigint;
    query.Economy.Inventory = query.Economy.Inventory.map((i) => {
      return { item: i.item, amount: Number(i.amount) as unknown as bigint };
    });
    if (query.Economy.EconomyGuildMember?.guild) {
      query.Economy.EconomyGuildMember.guild.balance = Number(
        query.Economy.EconomyGuildMember.guild?.balance,
      ) as unknown as bigint;
      query.Economy.EconomyGuildMember.guild.xp = Number(
        query.Economy.EconomyGuildMember.guild?.xp,
      ) as unknown as bigint;
    }
  }

  return json({ ...query, message: "success" });
};
