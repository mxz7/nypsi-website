import getItems from "$lib/functions/items";
import sleep from "$lib/functions/sleep";

export async function load({ fetch }) {
  await sleep(1000);
  return { items: await getItems(fetch) };
}
