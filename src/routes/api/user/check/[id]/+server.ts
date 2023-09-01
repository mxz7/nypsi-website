import prisma from "$lib/server/database.js";
import type { APIUserCheck } from "$lib/types/api/UserCheck.js";
import { error, json } from "@sveltejs/kit";

export async function GET({ setHeaders, params }) {
  const { id } = params;

  setHeaders({
    "cache-control": "s-maxage=600, stale-while-revalidate",
  });

  if (!id.match(/^\d{17,19}$/)) throw error(400, { message: "invalid user id" });

  const res: APIUserCheck = { message: "success", exists: false, private: false };

  const query = await prisma.preferences.findUnique({
    where: {
      userId: id,
    },
    select: {
      leaderboards: true,
    },
  });

  if (typeof query === "undefined") {
    res.exists = false;
  } else {
    res.exists = true;
    if (query.leaderboards) {
      res.private = false;
    } else {
      res.private = true;
    }
  }

  return json(res);
}
