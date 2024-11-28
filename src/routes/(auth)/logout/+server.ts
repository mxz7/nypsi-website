import { lucia } from "$lib/server/functions/auth.js";
import redis from "$lib/server/redis.js";
import { redirect } from "@sveltejs/kit";

export const GET = async ({ locals }) => {
  const auth = await locals.validate();

  if (!auth?.session) return redirect(302, "/");
  await lucia.invalidateSession(auth.session.id);
  await redis.del(`cache:session:${auth.session.id}`);

  return redirect(302, "/");
};
