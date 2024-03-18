import { lucia } from "$lib/server/functions/auth.js";
import { redirect } from "@sveltejs/kit";

export const config = {
  runtime: "edge",
  regions: "all",
};

export const GET = async ({ locals }) => {
  const auth = await locals.validate();

  if (!auth?.session) return redirect(302, "/");
  await lucia.invalidateSession(auth.session.id);

  return redirect(302, "/");
};
