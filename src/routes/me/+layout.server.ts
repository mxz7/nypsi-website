import getItems from "$lib/functions/getItems.js";
import prisma from "$lib/server/database.js";
import type { UserApiResponsexd } from "$lib/types/User.js";
import { redirect } from "@sveltejs/kit";

export async function load({ parent, url, fetch }) {
  const [{ user }, items] = await Promise.all([parent(), getItems()]);

  if (!user.authenticated)
    throw redirect(302, "/login?redirect=" + encodeURIComponent(url.toString()));

  const baseData = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      avatar: true,
      blacklisted: true,
      lastCommand: true,
      id: true,
      lastKnownUsername: true,
      Tags: {
        select: {
          selected: true,
          tagId: true,
        },
      },
      Premium: {
        select: {
          level: true,
        },
      },
    },
  });

  return {
    items,
    baseData,
    streamed: {
      userData: fetch(`/api/user/${user.id}`).then((r) => r.json() as Promise<UserApiResponsexd>),
    },
  };
}
