import prisma from "#lib/server/database.js";

export async function GET({ setHeaders, params }) {
  setHeaders({ "cache-control": "public, max-age=3600, must-revalidate" });

  if (params.itemId === "lottery_ticket") return Response.json({ count: 0 });

  const query = await prisma.inventory.aggregate({
    where: { item: params.itemId },
    _sum: { amount: true },
  });

  return Response.json({ count: Number(query._sum?.amount || "0") || 0 });
}
