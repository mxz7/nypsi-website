import { redirect } from "@sveltejs/kit";

export async function load({ parent }) {
  const data = await parent();

  if (!data.user) return;

  if (data.baseData?.Premium?.level > 0) redirect(301, "/me/graphs");
  else redirect(301, "/me/stats");
}
