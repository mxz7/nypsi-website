import prisma from "$lib/server/database.js";
import { json } from "@sveltejs/kit";

export const GET = async ({ params }) => {
  const query = await prisma.user.findFirst({
    where: {
      lastKnownUsername: params.username,
    },
    select: {
      id: true,
    },
  });

  if (query) return json(query);
  return json({ status: 404, error: 404, message: "not found" });
};
