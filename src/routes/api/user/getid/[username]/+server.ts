import prisma from '$lib/server/database.js';
import { json } from '@sveltejs/kit';

export const GET = async ({ params }) => {
  const query = await prisma.user.findFirst({
    where: {
      lastKnownUsername: params.username,
    },
    select: {
      id: true,
      lastKnownUsername: true,
      Preferences: {
        select: {
          leaderboards: true,
        },
      },
    },
  });

  if (!query) return json({ status: 404, error: 404, message: 'not found' });

  if (!query?.Preferences?.leaderboards)
    return json({ status: 451, error: 451, message: 'private profile' });

  return json(query);
};
