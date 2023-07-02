import getItems from "$lib/functions/getItems";
import prisma from "$lib/server/database.js";
import { error, json } from "@sveltejs/kit";
import type { ChartConfiguration } from "chart.js";
import dayjs from "dayjs";
import { inPlaceSort } from "fast-sort";

export const GET = async ({ params, setHeaders }) => {
  const item = params.item;

  setHeaders({
    "cache-control": "max-age=1200",
  });

  const items = await getItems();

  if (!items.find((i) => i.id === item)) throw error(400, { message: "invalid item" });

  const auctions = await prisma.auction.findMany({
    where: {
      AND: [{ itemId: item, sold: true }],
    },
    select: {
      bin: true,
      createdAt: true,
      itemAmount: true,
    },
  });

  const offers = await prisma.offer.findMany({
    where: {
      AND: [{ itemId: item }, { sold: true }],
    },
  });

  const itemCount = await prisma.graphMetrics.findMany({
    where: {
      AND: [{ category: "item-count-" + item }, { userId: "global" }],
    },
  });

  if (auctions.length < 2 && offers.length < 2 && itemCount.length < 2) {
    throw error(204, { message: "not enough data" });
  }

  const auctionAverages = new Map<string, number[]>();

  for (const item of auctions) {
    const date = dayjs(item.createdAt).format("YYYY-MM-DD");

    if (auctionAverages.has(date)) {
      auctionAverages.get(date)?.push(Number(item.bin / item.itemAmount));
    } else {
      auctionAverages.set(date, [Number(item.bin / item.itemAmount)]);
    }
  }

  const offerAverages = new Map<string, number[]>();

  for (const item of offers) {
    const date = dayjs(item.soldAt).format("YYYY-MM-DD");

    if (offerAverages.has(date)) {
      offerAverages.get(date)?.push(Number(item.money / item.itemAmount));
    } else {
      offerAverages.set(date, [Number(item.money / item.itemAmount)]);
    }
  }

  const itemCounts = new Map<string, number>();

  for (const item of itemCount) {
    itemCounts.set(dayjs(item.date).format("YYYY-MM-DD"), Number(item.value));
  }

  const graphData: ChartConfiguration = {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          yAxisID: "y1",
          label: "auctions",
          data: [],
          fill: false,
        },
        {
          yAxisID: "y1",
          label: "offers",
          data: [],
          fill: false,
        },
        {
          yAxisID: "y2",
          label: "items in world",
          data: [],
          fill: true,
        },
      ],
    },
  };

  for (const key of auctionAverages.keys()) {
    if (!graphData.data.labels.includes(dayjs(key).format("YYYY-MM-DD")))
      graphData.data.labels.push(dayjs(key).format("YYYY-MM-DD"));
  }

  for (const key of offerAverages.keys()) {
    if (!graphData.data.labels.includes(dayjs(key).format("YYYY-MM-DD")))
      graphData.data.labels.push(dayjs(key).format("YYYY-MM-DD"));
  }

  for (const i of itemCount) {
    if (!graphData.data.labels.includes(dayjs(i.date).format("YYYY-MM-DD")))
      graphData.data.labels.push(dayjs(i.date).format("YYYY-MM-DD"));
  }

  inPlaceSort(graphData.data.labels as string[]).asc((i) => dayjs(i, "YYYY-MM-DD").unix());

  for (let i = 0; i < graphData.data.labels.length; i++) {
    if (!graphData.data.labels[i + 1]) break;

    const date1 = dayjs(graphData.data.labels[i] as string, "YYYY-MM-DD");
    const date2 = dayjs(graphData.data.labels[i + 1] as string, "YYYY-MM-DD");

    if (!date1.add(1, "day").isSame(date2)) {
      graphData.data.labels.splice(i + 1, 0, date1.add(1, "day").format("YYYY-MM-DD"));
    }
  }

  for (const dateString of graphData.data.labels as string[]) {
    const index = graphData.data.labels.indexOf(dateString);

    if (auctionAverages.has(dateString)) {
      graphData.data.datasets[0].data.push(
        Math.floor(
          auctionAverages.get(dateString).reduce((a, b) => a + b) /
            auctionAverages.get(dateString).length
        )
      );
    } else if (index > 0) {
      graphData.data.datasets[0].data.push(graphData.data.datasets[0].data[index - 1]);
    } else {
      graphData.data.datasets[0].data.push(0);
    }

    if (offerAverages.has(dateString)) {
      graphData.data.datasets[1].data.push(
        Math.floor(
          offerAverages.get(dateString).reduce((a, b) => a + b) /
            offerAverages.get(dateString).length
        )
      );
    } else if (index > 0) {
      graphData.data.datasets[1].data.push(graphData.data.datasets[1].data[index - 1]);
    } else {
      graphData.data.datasets[1].data.push(0);
    }

    if (itemCounts.has(dateString)) {
      graphData.data.datasets[2].data.push(itemCounts.get(dateString));
    } else if (index > 0) {
      graphData.data.datasets[2].data.push(graphData.data.datasets[2].data[index - 1]);
    } else {
      graphData.data.datasets[2].data.push(0);
    }
  }

  return json(graphData);
};
