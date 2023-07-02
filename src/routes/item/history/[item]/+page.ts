import getItems from "$lib/functions/getItems.js";
import { error } from "@sveltejs/kit";
import type { ChartConfiguration } from "chart.js";

export const load = async ({ params, fetch }) => {
  const item = await getItems().then((items) => items.find((i) => i.id === params.item));

  if (!item) throw error(400, "invalid item");

  const data: Promise<ChartConfiguration> = fetch("/api/itemhistory/" + params.item).then((r) =>
    r.json()
  );

  return { base: 69, item, streamed: { graphData: data } };
};
