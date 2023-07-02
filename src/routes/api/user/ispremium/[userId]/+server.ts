import prisma from "$lib/server/database.js";
import { error, json } from "@sveltejs/kit";

export const GET = async ({ params, setHeaders }) => {
  const userId = params.userId;

  setHeaders({
    "cache-control": "max-age=1200",
  });

  if (!userId.match(/^\d{17,19}$/)) throw error(400, { message: "invalid user id" });

  const privacyCheck = await prisma.preferences.findUnique({
    where: {
      userId: userId,
    },
    select: {
      leaderboards: true,
    },
  });

  if (!privacyCheck) throw error(404, { message: "user not found" });

  if (!privacyCheck.leaderboards) throw error(403, { message: "user has a private profile" });

  const query = await prisma.premium.findUnique({
    where: {
      userId,
    },
    select: {
      userId: true,
    },
  });

  return json({ premium: Boolean(query) });
};
