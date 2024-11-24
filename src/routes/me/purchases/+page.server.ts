import prisma from "$lib/server/database.js";
import { redirect } from "@sveltejs/kit";

export async function load({ setHeaders, parent, fetch }) {
  const parentData = await parent();

  if (!parentData.user) return redirect(303, "/me");

  try {
    setHeaders({
      "cache-control": "private, max-age=300, must-revalidate",
    });
  } catch {}

  return {
    premium: await fetch(`/api/user/ispremium/${parentData.user.id}`).then((r) => r.json()),
    totalSpend: await prisma.user
      .findUnique({ where: { id: parentData.user.id }, select: { totalSpend: true } })
      .then((r) => r?.totalSpend || 0),
    history: await prisma.kofiPurchases.findMany({
      where: { userId: parentData.user.id },
      select: { date: true, item: true },
      orderBy: { date: "desc" },
    }),
  };
}
