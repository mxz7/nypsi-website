import getItems from "$lib/functions/items";

export async function load({ fetch }) {
  return { items: await getItems(fetch) };
}
