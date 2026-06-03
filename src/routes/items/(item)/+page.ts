import { getItemsRemote } from "$lib/api/items.remote.js";
import { redirect } from "@sveltejs/kit";

export async function load() {
  const items = await getItemsRemote();
  const random = items[Math.floor(Math.random() * items.length)];

  return redirect(302, `/items/${random.id}`);
}
