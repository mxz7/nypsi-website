import { error } from "@sveltejs/kit";
import type { APIWordleGame } from "../../api/wordle/[id]/+server.js";

export const load = async ({ fetch, params }) => {
  const res = await fetch(`/api/wordle/${params.id}`);

  if (res.status !== 200) return error(res.status, { message: res.statusText });

  return { game: (await res.json()) as APIWordleGame };
};
