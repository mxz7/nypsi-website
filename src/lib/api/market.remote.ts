import { query } from "$app/server";
import prisma from "$lib/server/database";
import z from "zod";

export const getOrders = query(
  z.object({ itemId: z.string(), page: z.number().min(1).default(1) }),
  async ({ itemId, page }) => {
    const orders = await prisma.market.findMany({
      where: {
        itemId,
      },
      orderBy: {
        id: "desc",
      },
      take: 25,
      skip: 25 * (page - 1),
      select: {
        messageId: true,
        completed: true,
        createdAt: true,
        itemAmount: true,
        price: true,
        orderType: true,
        owner: {
          select: {
            user: {
              select: {
                id: true,
                lastKnownUsername: true,
                avatar: true,
                Preferences: {
                  select: {
                    leaderboards: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return orders.map((order) => {
      const shouldAnonymize = !order.owner.user.Preferences?.leaderboards;

      const owner = shouldAnonymize
        ? {
            id: 0,
          }
        : {
            id: order.owner.user.id,
            username: order.owner.user.lastKnownUsername,
            avatar: order.owner.user.avatar,
          };

      return {
        ...order,
        owner,
      };
    });
  },
);
