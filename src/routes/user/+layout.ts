import getItems from "$lib/functions/items.js";
import { getTags } from "$lib/functions/tags.js";

export async function load({ url, fetch }) {
  return { items: await getItems(fetch), tags: await getTags(fetch) };
}
