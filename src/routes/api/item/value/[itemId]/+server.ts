import { env } from "$env/dynamic/private";
import { json } from "@sveltejs/kit";

export async function GET({ setHeaders, params, fetch }) {
  setHeaders({ "cache-control": "public, max-age=3600, must-revalidate" });

  const value = await fetch(`${env.BOT_SERVER_URL}/item/value/${params.itemId}`, {
    headers: {
      Authorization: `Bearer ${env.BOT_API_AUTH}`,
    },
  }).then((r) => {
    if (r.ok) {
      return r.json().then((r) => r.value as number);
    } else {
      return 0;
    }
  });

  return json({ value });
}
