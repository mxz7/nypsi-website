import { BOT_SERVER_URL } from "$env/static/private";
import { json } from "@sveltejs/kit";

export async function GET({ setHeaders, params, fetch }) {
  setHeaders({ "cache-control": "public, s-maxage=600" });

  const value = await fetch(`${BOT_SERVER_URL}/item/value/${params.itemId}`).then(async (r) => {
    if (r.ok) return r.json().then((r) => r.value as number);
    else return 0;
  });

  return json({ value });
}
