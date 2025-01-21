import prisma from "$lib/server/database.js";
import { error, json } from "@sveltejs/kit";

export async function GET({ params, fetch, setHeaders }) {
  const userId = params.userId;

  setHeaders({
    "cache-control": "public, max-age=600, must-revalidate",
  });

  if (!userId.match(/^\d{17,19}$/)) return error(400, "invalid user id");

  const query = await prisma.user.findUnique({
    where: {
      id: userId,
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
          embedColor: true,
        },
      },
      Preferences: {
        select: {
          leaderboards: true,
        },
      },
    },
  });

  if (!query) return error(404, "unknown user");

  if (query.Preferences) {
    if (!query.Preferences.leaderboards) {
      return error(403, "private profile");
    }
  }

  return json(query);
}
