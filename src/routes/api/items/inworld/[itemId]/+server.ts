import prisma from "$lib/server/database.js";
import { json } from "@sveltejs/kit";

export async function GET({ setHeaders, params }) {
  setHeaders({ "cache-control": "public, max-age=3600, must-revalidate" });

  if (params.itemId === "lottery_ticket") return json({ count: 0 });

  const query = await prisma.inventory.aggregate({
    where: { item: params.itemId },
    _sum: { amount: true },
  });

  return json({ count: Number(query._sum?.amount || "0") || 0 });
}
