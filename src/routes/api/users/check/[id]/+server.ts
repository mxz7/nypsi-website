import prisma from "$lib/server/database.js";
import { isPrivate, privacyPreferenceSelection } from "$lib/server/preferences";
import type { APIUserCheck } from "$lib/types/api/UserCheck.js";
import { error, json } from "@sveltejs/kit";

export async function GET({ setHeaders, params }) {
  const { id } = params;

  setHeaders({
    "cache-control": "public, max-age=600, must-revalidate",
  });

  if (!id.match(/^\d{17,19}$/)) return error(400, { message: "invalid user id" });

  const res: APIUserCheck = { ok: true, exists: false, private: false };

  const query = await prisma.user.findUnique({
    where: { id },
    select: {
      Preferences: privacyPreferenceSelection,
    },
  });

  if (!query) {
    res.exists = false;
  } else {
    res.exists = true;
    res.private = isPrivate(query.Preferences);
  }

  return json(res);
}
