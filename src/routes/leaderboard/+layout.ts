import getItems from "$lib/functions/items";

export const config = {
  runtime: "edge",
  regions: "all",
};

export async function load() {
  return { items: await getItems() };
}
