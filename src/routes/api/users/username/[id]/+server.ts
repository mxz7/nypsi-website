import prisma from "$lib/server/database.js";
import { error, json } from "@sveltejs/kit";

export async function GET({ setHeaders, params }) {
  setHeaders({ "cache-control": "public, max-age=600, must-revalidate" });

  const query = await prisma.user.findFirst({
    where: {
      id: params.id,
    },
    select: {
      lastKnownUsername: true,
    },
  });

  if (!query) return error(404, { message: "user not found" });

  return json({ username: query.lastKnownUsername });
}
