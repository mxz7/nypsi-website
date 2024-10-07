import prisma from "$lib/server/database.js";
import { error, json } from "@sveltejs/kit";

export const GET = async ({ params, setHeaders }) => {
  const userId = params.userId;

  setHeaders({
    "cache-control": "public, max-age=600, must-revalidate",
  });

  if (!userId.match(/^\d{17,19}$/)) return error(400, { message: "invalid user id" });

  const privacyCheck = await prisma.preferences.findUnique({
    where: {
      userId: userId,
    },
    select: {
      leaderboards: true,
    },
  });

  if (!privacyCheck) return error(404, { message: "user not found" });

  if (!privacyCheck.leaderboards) return error(403, { message: "user has a private profile" });

  const query = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      booster: true,
      adminLevel: true,
      Premium: {
        select: {
          level: true,
        },
      },
    },
  });

  return json({
    premium: Boolean(query?.booster || query?.Premium?.level || query?.adminLevel > 0),
  });
};
