import prisma from "$lib/server/database.js";
import { redirect } from "@sveltejs/kit";

export async function load({ setHeaders, parent, fetch, request }) {
  const parentData = await parent();

  if (!parentData.user) return redirect(303, "/me");

  try {
    setHeaders({
      "cache-control": "private, max-age=300, must-revalidate",
    });
  } catch {}

  const acceptLanguage = request.headers.get("accept-language");

  return {
    locale: acceptLanguage?.split(",")[0],
    premium: await fetch(`/api/users/ispremium/${parentData.user.id}`).then((r) => r.json()),
    totalSpend: await prisma.purchases
      .aggregate({
        _sum: {
          cost: true,
        },
        where: { userId: parentData.user.id },
      })
      .then((r) => r._sum.cost?.toNumber() || 0),
    history: await prisma.purchases
      .findMany({
        where: { userId: parentData.user.id },
        select: {
          amount: true,
          cost: true,
          createdAt: true,
          item: true,
          source: true,
        },
        orderBy: { createdAt: "desc" },
      })
      .then((r) => r.map((r) => ({ ...r, cost: r.cost.toNumber() }))),
  };
}
