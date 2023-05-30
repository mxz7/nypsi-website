import getItem from "$lib/functions/getItem.js";
import getItems from "$lib/functions/getItems.js";

export async function load({ fetch, params }) {
  const itemData = await getItem(fetch, params.itemId);
  const item = await getItems().then((i) => i.find((i) => i.id === params.itemId));

  if (itemData && item) {
    return { item, itemData };
  }
  return { item: null, itemData: null };
}
