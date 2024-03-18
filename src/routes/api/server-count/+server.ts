import { TOPGG_TOKEN } from "$env/static/private";
import redis from "$lib/server/redis.js";
import { json } from "@sveltejs/kit";

export const config = {
  runtime: "edge",
  regions: "all",
};

export const GET = async ({ setHeaders }) => {
  setHeaders({
    "cache-control": "max-age=0, s-maxage=600, stale-while-revalidate",
  });

  if (await redis.exists("server-count")) {
    return json(await redis.get("server-count"));
  }

  const res = await fetch("https://top.gg/api/bots/678711738845102087/stats", {
    headers: {
      Authorization: TOPGG_TOKEN,
    },
  }).then((r) =>
    r.json().catch(() => {
      // boobies
    }),
  );

  await redis.set("server-count", JSON.stringify(res), { ex: 120 });

  return json(res);
};
