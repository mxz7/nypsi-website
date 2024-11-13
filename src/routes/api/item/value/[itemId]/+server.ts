import { env } from "$env/dynamic/private";
import { json } from "@sveltejs/kit";

export const config = {
  runtime: "edge",
  regions: "all",
};

export async function GET({ setHeaders, params, fetch }) {
  setHeaders({ "cache-control": "public, max-age=600" });

  const value = await fetch(`${env.BOT_SERVER_URL}/item/value/${params.itemId}`).then(async (r) => {
    if (r.ok) return r.json().then((r) => r.value as number);
    else return 0;
  });

  return json({ value });
}
