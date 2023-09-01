import prisma from "$lib/server/database.js";
import { error, json } from "@sveltejs/kit";

export const GET = async ({ params, setHeaders }) => {
  setHeaders({
    "cache-control": "s-maxage=3600",
  });

  const query = await prisma.user.findFirst({
    where: {
      lastKnownUsername: params.username,
    },
    select: {
      id: true,
      lastKnownUsername: true,
      Preferences: {
        select: {
          leaderboards: true,
        },
      },
    },
  });

  if (!query) throw error(404, { message: "unknown user" });

  if (!query?.Preferences?.leaderboards) throw error(451, { message: "private profile" });

  return json({ id: query.id, username: query.lastKnownUsername });
};
