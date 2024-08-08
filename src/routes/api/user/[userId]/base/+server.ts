import prisma from "$lib/server/database.js";
import { privacyCheck } from "$lib/server/functions/user/privacy.js";
import { error, json } from "@sveltejs/kit";

export async function GET({ params, fetch, setHeaders }) {
  const userId = params.userId;

  setHeaders({
    "cache-control": "public, max-age=600",
  });

  if (!userId.match(/^\d{17,19}$/)) return error(400, { message: "invalid user id" });

  const cont = await privacyCheck(userId, fetch);
  if (cont !== "continue") throw cont;

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
        },
      },
    },
  });

  return json(query);
}
