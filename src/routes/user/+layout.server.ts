import prisma from "$lib/server/database.js";
import rateLimiter from "$lib/server/ratelimit.js";
import { redirect } from "@sveltejs/kit";

export const load = async ({ url, getClientAddress }) => {
  const search = url.searchParams.get("search");

  if (!search) {
    return;
  }

  const rateLimitAttempt = await rateLimiter.limit(getClientAddress());

  if (!rateLimitAttempt.success) {
    return { error: 429 };
  }

  const query = await prisma.user.findFirst({
    where: {
      lastKnownUsername: search,
    },
    select: {
      id: true,
    },
  });

  if (query) {
    throw redirect(302, `/user/${query.id}`);
  } else {
    throw redirect(302, "/user/unknown");
  }
};
