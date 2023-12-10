import getItems from "$lib/functions/getItems.js";

export const config = {
  runtime: "edge",
  regions: "all",
};

export async function load({ setHeaders }) {
  setHeaders({
    "cache-control": "s-maxage=3600, stale-while-revalidate",
  });

  return {
    items: getItems(),
  };
}
