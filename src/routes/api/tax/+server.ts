import { BOT_SERVER_URL } from "$env/static/private";
import { json } from "@sveltejs/kit";

export const GET = async ({ setHeaders }) => {
  setHeaders({ "cache-control": "public, max-age=600" });

  const res = await fetch(`${BOT_SERVER_URL}/tax`).then((r) =>
    r.json().catch(() => {
      // oops
    }),
  );

  return json(res);
};
