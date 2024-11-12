import getItems from "$lib/functions/items";
import { getTags } from "$lib/functions/tags.js";

export const config = {
  runtime: "edge",
  regions: "all",
};

export async function load({ fetch }) {
  return { items: await getItems(fetch), tags: await getTags(fetch) };
}
