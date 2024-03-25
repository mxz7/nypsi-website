import { TOPGG_TOKEN } from "$env/static/private";
import { json } from "@sveltejs/kit";

export const config = {
  runtime: "edge",
  regions: "all",
};

export const GET = async ({ setHeaders }) => {
  setHeaders({
    "cache-control": "max-age=0, s-maxage=300, stale-while-revalidate",
  });

  const res = await fetch("https://top.gg/api/bots/678711738845102087/stats", {
    headers: {
      Authorization: TOPGG_TOKEN,
    },
  }).then((r) =>
    r.json().catch(() => {
      // boobies
    }),
  );

  return json(res);
};
