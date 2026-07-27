import prisma from "$lib/server/database.js";
import { isPrivate, privacyPreferenceSelection } from "$lib/server/preferences";
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
      Preferences: privacyPreferenceSelection,
    },
  });

  if (!query) return error(404, "unknown user");

  if (isPrivate(query.Preferences)) return error(403, "private profile");

  return json(query);
}
