import prisma from '$lib/server/database.js';
import { redirect } from '@sveltejs/kit';

export async function load({ setHeaders, parent }) {
  const parentData = await parent();

  if (!parentData.user.authenticated) throw redirect(303, '/me');

  setHeaders({
    'cache-control': 'max-age=300',
  });

  return {
    streamed: {
      totalCost: prisma.user
        .findUnique({ where: { id: parentData.user.id }, select: { totalSpend: true } })
        .then((r) => r?.totalSpend || 0),
      history: prisma.kofiPurchases.findMany({
        where: { userId: parentData.user.id },
        select: { date: true, item: true },
        orderBy: { date: 'desc' },
      }),
    },
  };
}
