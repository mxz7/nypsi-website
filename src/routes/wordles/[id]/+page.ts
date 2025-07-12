import { error } from "@sveltejs/kit";
import type { APIWordleGame } from "../../api/wordles/[id]/+server.js";

export const load = async ({ fetch, params }) => {
  const res = await fetch(`/api/wordles/${params.id}`);

  if (res.status !== 200) return error(res.status, { message: res.statusText });

  return { game: (await res.json()) as APIWordleGame };
};
