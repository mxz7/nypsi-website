import { redirect } from "@sveltejs/kit";

export async function load({ parent }) {
  const data = await parent();

  if (!data.user.authenticated) return;

  if (data.baseData?.Premium?.level > 0) throw redirect(301, "/me/graphs");
  else throw redirect(301, "/me/stats");
}
