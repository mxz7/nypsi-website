import { getItemsRemote } from "$lib/api/items.remote";

export async function load() {
  return { items: await getItemsRemote() };
}
