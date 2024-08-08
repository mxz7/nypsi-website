import prisma from "$lib/server/database.js";
import { error, json } from "@sveltejs/kit";

export const GET = async ({ params, setHeaders }) => {
  setHeaders({
    "cache-control": "public, max-age=600",
  });

  const query = await prisma.user.findFirst({
    where: {
      lastKnownUsername: { equals: params.username, mode: "insensitive" },
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

  if (!query) return error(404, { message: "unknown user" });

  if (!query?.Preferences?.leaderboards) return error(451, { message: "private profile" });

  return json({ id: query.id, username: query.lastKnownUsername });
};
