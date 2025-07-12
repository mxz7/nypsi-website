import prisma from "$lib/server/database.js";
import { error, json } from "@sveltejs/kit";

export async function GET({ params, setHeaders, fetch }) {
  setHeaders({
    "cache-control": "public, max-age=3600, must-revalidate",
  });

  const game = await prisma.wordleGame.findUnique({
    where: { id: parseInt(params.id, 36) },
    include: {
      user: {
        select: {
          lastKnownUsername: true,
        },
      },
    },
  });

  if (!game) return error(404);

  const privacy = await fetch(`/api/users/check/${game.userId}`).then((r) => r.json());

  if (privacy.private) {
    game.userId = "hidden";
    game.user.lastKnownUsername = "[hidden]";
  }

  return json(game);
}

export type APIWordleGame = {
  user: {
    lastKnownUsername: string;
  };

  id: number;
  guesses: string[];
  word: string;
  won: boolean;
  time: number;
  userId: string;
};
