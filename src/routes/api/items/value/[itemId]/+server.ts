import { BOT_SERVER_URL, BOT_API_AUTH } from "$app/env/private";

export async function GET({ setHeaders, params, fetch }) {
  setHeaders({ "cache-control": "public, max-age=3600, must-revalidate" });

  const value = await fetch(`${BOT_SERVER_URL}/items/${params.itemId}/value`, {
    headers: { Authorization: `Bearer ${BOT_API_AUTH}` },
  }).then((r) => {
    if (r.ok) {
      return r.json().then((r) => r.value as number);
    } else {
      return 0;
    }
  });

  return Response.json({ value });
}
