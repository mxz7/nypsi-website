import getItems from "$lib/functions/getItems.js";
import { error } from "@sveltejs/kit";
import type { ChartConfiguration } from "chart.js";

export const load = async ({ params, fetch, parent }) => {
  const parentData = await parent();

  if (!parentData.premium || !parentData.user.authenticated) return;

  const item = await getItems().then((items) => items.find((i) => i.id === params.item));

  if (!item) throw error(400, "invalid item");

  const data: Promise<ChartConfiguration> = fetch(
    `/api/itemhistory/${params.item}?user=${parentData.user.id}`
  ).then((r) => r.json());

  return { base: 69, item, streamed: { graphData: data } };
};
