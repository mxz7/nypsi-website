import { env } from "$env/dynamic/private";
import { json } from "@sveltejs/kit";

export const GET = async ({ setHeaders }) => {
  setHeaders({ "cache-control": "public, max-age=600, must-revalidate" });

  const res = await fetch(`${env.BOT_SERVER_URL}/tax`).then((r) =>
    r.json().catch(() => {
      // oops
    }),
  );

  return json(res);
};
