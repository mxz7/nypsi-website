import prisma from "$lib/server/database.js";
import { redirect } from "@sveltejs/kit";

export async function load({ setHeaders, parent }) {
  setHeaders({
    "cache-control": "no-cache",
  });

  const parentData = await parent();

  if (!parentData.user) return redirect(303, "/me");

  return {
    premium: prisma.premium
      .findUnique({ where: { userId: parentData.user.id }, select: { userId: true } })
      .then((r) => Boolean(r)),
    totalCost: prisma.user
      .findUnique({ where: { id: parentData.user.id }, select: { totalSpend: true } })
      .then((r) => r?.totalSpend || 0),
    history: prisma.kofiPurchases.findMany({
      where: { userId: parentData.user.id },
      select: { date: true, item: true },
      orderBy: { date: "desc" },
    }),
  };
}
