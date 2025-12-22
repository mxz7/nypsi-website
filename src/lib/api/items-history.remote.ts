import { query } from "$app/server";
import getItemHistoryData from "$lib/server/functions/graphs/getItemHistoryData";
import { error } from "@sveltejs/kit";
import { z } from "zod";
import { getItemsRemote } from "./items.remote";

export const getItemChartData = query(
  z.object({
    itemId: z.string(),
    days: z.number().min(1),
  }),
  async ({ itemId, days }) => {
    const items = await getItemsRemote();
    const item = items.find((i) => i.id === itemId);

    if (!item) {
      error(404, "item not found");
    }

    return await getItemHistoryData(items, itemId, days);
  },
);
