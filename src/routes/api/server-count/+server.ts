import { env } from "$env/dynamic/private";
import { json } from "@sveltejs/kit";

export const GET = async ({ setHeaders }) => {
  setHeaders({
    "cache-control": "public, max-age=900",
  });

  const res = await fetch("https://top.gg/api/bots/678711738845102087/stats", {
    headers: {
      Authorization: env.TOPGG_TOKEN,
    },
  }).then((r) =>
    r.json().catch(() => {
      // boobies
    }),
  );

  return json(res);
};
