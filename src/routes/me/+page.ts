import { redirect } from "@sveltejs/kit";

export async function load({ parent }) {
  const parentData = await parent();

  if (!parentData.user) return;

  return redirect(302, "/me/stats");
}
