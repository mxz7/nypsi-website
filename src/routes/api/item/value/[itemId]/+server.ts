import { BOT_SERVER_URL } from "$env/static/private";
import { json } from "@sveltejs/kit";

export const config = {
  runtime: "edge",
  regions: "all",
};

export async function GET({ setHeaders, params, fetch }) {
  setHeaders({ "cache-control": "public, s-maxage=3600" });

  console.log(`${BOT_SERVER_URL}/item/value/${params.itemId}`);

  const value = await fetch(`${BOT_SERVER_URL}/item/value/${params.itemId}`).then(async (r) => {
    if (r.ok) {
      return r.json().then((r) => r.value as number);
    } else {
      console.error(r);
      return 0;
    }
  });

  console.log(value);

  return json({ value });
}
