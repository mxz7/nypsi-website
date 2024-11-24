import prisma from "$lib/server/database.js";
import { error, json } from "@sveltejs/kit";

export const GET = async ({ params, setHeaders }) => {
  setHeaders({
    "cache-control": "public, max-age=3600, must-revalidate",
  });

  const query = await prisma.user.findFirst({
    where: {
      lastKnownUsername: { equals: params.username, mode: "insensitive" },
    },
    select: {
      id: true,
      lastKnownUsername: true,
    },
  });

  if (!query) return error(404, { message: "unknown user" });

  return json({ id: query.id, username: query.lastKnownUsername });
};
