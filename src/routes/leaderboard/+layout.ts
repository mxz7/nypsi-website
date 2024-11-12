import getItems from "$lib/functions/items";

export async function load() {
  return { items: await getItems() };
}
