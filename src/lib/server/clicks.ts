import { createHash } from "node:crypto";
import prisma from "$lib/server/database";
import { isPrivate, privacyPreferenceSelection } from "$lib/server/preferences";

export const CLICK_EVENTS_CHANNEL = "nypsi:clicks";

export type ClickEvent = {
  userId: string;
  clicks: number;
  lastClick: string;
};

export type ClickRow = {
  key: string;
  userId?: string;
  username: string;
  avatar?: string;
  clicks: number;
  lastClick: string;
};

export type ClickSnapshot = {
  clicks: ClickRow[];
  globalClicks: number;
  users: number;
};

type ClickUser = {
  avatar: string;
  Preferences: { value: unknown }[];
  lastKnownUsername: string;
};

type PublicClickUser = Pick<ClickUser, "avatar" | "lastKnownUsername">;

function getClickKey(userId: string) {
  return createHash("sha256").update(userId).digest("hex").slice(0, 16);
}

function getPublicClickUser(user: ClickUser): PublicClickUser | undefined {
  if (isPrivate(user.Preferences)) return;

  return { avatar: user.avatar, lastKnownUsername: user.lastKnownUsername };
}

function toClickRow(
  click: { userId: string; clicks: number; lastClick: Date },
  user: ClickUser,
): ClickRow {
  const publicUser = getPublicClickUser(user);

  return {
    key: getClickKey(click.userId),
    userId: publicUser ? click.userId : undefined,
    username: publicUser?.lastKnownUsername.split("#")[0] || "[hidden]",
    avatar: publicUser?.avatar,
    clicks: click.clicks,
    lastClick: click.lastClick.toISOString(),
  };
}

export async function getClickSnapshot(): Promise<ClickSnapshot> {
  const where = { clicks: { gt: 0 } } as const;
  const [clicks, totals] = await Promise.all([
    prisma.clicks.findMany({
      where,
      select: {
        userId: true,
        clicks: true,
        lastClick: true,
        user: {
          select: {
            user: {
              select: {
                avatar: true,
                Preferences: privacyPreferenceSelection,
                lastKnownUsername: true,
              },
            },
          },
        },
      },
      orderBy: { lastClick: "desc" },
      take: 25,
    }),
    prisma.clicks.aggregate({
      where,
      _count: { userId: true },
      _sum: { clicks: true },
    }),
  ]);

  return {
    clicks: clicks.map((click) => toClickRow(click, click.user.user)),
    globalClicks: totals._sum.clicks ?? 0,
    users: totals._count.userId,
  };
}

export function getClickRow(event: ClickEvent, user?: PublicClickUser): ClickRow | null {
  const lastClick = new Date(event.lastClick);

  if (
    !event.userId ||
    !Number.isSafeInteger(event.clicks) ||
    event.clicks < 1 ||
    Number.isNaN(lastClick.getTime())
  )
    return null;

  return {
    key: getClickKey(event.userId),
    userId: user ? event.userId : undefined,
    username: user?.lastKnownUsername.split("#")[0] || "[hidden]",
    avatar: user?.avatar,
    clicks: event.clicks,
    lastClick: lastClick.toISOString(),
  };
}
