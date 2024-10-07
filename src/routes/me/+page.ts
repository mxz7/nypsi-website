import { redirect } from "@sveltejs/kit";

export async function load({ parent, setHeaders }) {
  setHeaders({ "cache-control": "public, max-age=600, must-revalidate" });

  const data = await parent();

  if (!data.user) return;

  if (data.baseData?.Premium?.level > 0) redirect(301, "/me/graphs");
  else redirect(301, "/me/stats");
}
