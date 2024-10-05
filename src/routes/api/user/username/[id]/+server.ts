import prisma from "$lib/server/database.js";
import { json } from "@sveltejs/kit";

export async function GET({ setHeaders, params }) {
  setHeaders({ "cache-control": "public, max-age=600" });

  const query = await prisma.user.findFirst({
    where: {
      id: params.id,
    },
    select: {
      lastKnownUsername: true,
      Preferences: {
        select: {
          leaderboards: true,
        },
      },
    },
  });

  if (!query) return json({ status: 404, error: 404, message: "not found" });

  if (!query?.Preferences?.leaderboards)
    return json({ status: 451, error: 451, message: "private profile" });

  return json({ username: query.lastKnownUsername });
}
