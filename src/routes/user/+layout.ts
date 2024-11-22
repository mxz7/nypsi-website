import getItems from "$lib/functions/items.js";

export async function load({ url, fetch }) {
  return { items: await getItems(fetch) };
}
