import { query } from "$app/server";
import prisma from "$lib/server/database";
import redis from "$lib/server/redis";
import type { OrderType } from "@generated/prisma";
import ms from "ms";
import z from "zod";

type MarketOrder = {
  owner: {
    id: string;
    username: string;
    avatar: string;
  };
  itemAmount: number;
  price: bigint;
  orderType: OrderType;
  messageId: string;
  createdAt: Date;
  completed: boolean;
};

export const getOrders = query(
  z.object({ itemId: z.string(), page: z.number().min(1).default(1) }),
  async ({ itemId, page }) => {
    const cache = await redis.get(`cache:market:orders:${itemId}:p${page}`);

    if (cache) {
      const parsed = JSON.parse(cache);

      return parsed.map((order) => {
        return { ...order, createdAt: new Date(order.createdAt) };
      }) as MarketOrder[];
    }

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

    const transformed = orders.map((order) => {
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
    }) as MarketOrder[];

    await redis.set(
      `cache:market:orders:${itemId}:p${page}`,
      JSON.stringify(transformed, (key, value) =>
        typeof value === "bigint" ? Number(value) : value,
      ),
      "EX",
      ms("12 hours") / 1000,
    );

    return transformed;
  },
);
