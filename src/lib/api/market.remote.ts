import { query } from "$app/server";
import prisma from "$lib/server/database";
import redis from "$lib/server/redis";
import type { OrderType } from "@generated/prisma";
import { sort } from "fast-sort";
import ms from "ms";
import z from "zod";

type MarketOrder = {
  owner?: {
    id: string;
    username: string;
    avatar: string;
  };
  itemAmount: number | bigint;
  price: bigint | number;
  orderType: OrderType;
  messageId?: string;
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

    const marketOrders = await prisma.market.findMany({
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

    const offers = await prisma.offer.findMany({
      where: {
        AND: [{ itemId }, { sold: true }],
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 25,
      skip: 25 * (page - 1),
      select: {
        soldAt: true,
        itemAmount: true,
        money: true,
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

    const transformedOrders: MarketOrder[] = marketOrders.map((order) => {
      const shouldAnonymize = !order.owner.user.Preferences?.leaderboards;

      const owner = shouldAnonymize
        ? null
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

    const transformedOffers: MarketOrder[] = offers.map((offer) => {
      const shouldAnonymize = !offer.owner.user.Preferences?.leaderboards;

      const owner = shouldAnonymize
        ? null
        : {
            id: offer.owner.user.id,
            username: offer.owner.user.lastKnownUsername,
            avatar: offer.owner.user.avatar,
          };

      return {
        orderType: "buy",
        itemAmount: offer.itemAmount,
        price: Math.round(Number(offer.money) / Number(offer.itemAmount)),
        completed: true,
        createdAt: offer.soldAt,
        owner,
      };
    });

    const orders = sort([...transformedOrders, ...transformedOffers]).desc((i) => i.createdAt);

    await redis.set(
      `cache:market:orders:${itemId}:p${page}`,
      JSON.stringify(orders, (key, value) => (typeof value === "bigint" ? Number(value) : value)),
      "EX",
      ms("12 hours") / 1000,
    );

    return orders;
  },
);
