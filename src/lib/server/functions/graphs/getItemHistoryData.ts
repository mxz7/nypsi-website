import filterOutliers from "$lib/functions/filterOutliers";
import prisma from "$lib/server/database.js";
import redis from "$lib/server/redis";
import type { Item } from "$lib/types/Item";
import type { ChartConfiguration } from "chart.js";
import dayjs from "dayjs";
import { inPlaceSort } from "fast-sort";
import ms from "ms";

type ProcessedGraphData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
};

async function getRawData(item: string) {
  const cache = await redis.get(`cache:item:history:${item}`);

  if (cache) {
    return JSON.parse(cache) as ProcessedGraphData | "not enough data";
  }

  const orders = await prisma.market
    .findMany({
      where: {
        AND: [{ itemId: item }, { completed: true }],
      },
      select: {
        itemAmount: true,
        createdAt: true,
        price: true,
      },
    })
    .then((r) => {
      const filtered = filterOutliers(
        r.map((i) => ({ amount: i.itemAmount, money: Number(i.price), date: i.createdAt })),
      );
      if (!filtered) {
        console.warn(`failed to filter outliers on ${item}`);
      }

      return filtered.map((i) => ({
        itemAmount: i.amount,
        price: i.money,
        date: i.date,
      }));
    });

  const offers = await prisma.offer
    .findMany({
      where: {
        AND: [{ itemId: item }, { sold: true }],
      },
      select: {
        money: true,
        soldAt: true,
        itemAmount: true,
      },
    })
    .then((q) => {
      const filtered = filterOutliers(
        q.map((i) => {
          return { amount: Number(i.itemAmount), money: Number(i.money), date: i.soldAt };
        }),
      );
      if (!filtered) {
        console.warn(`failed to filter outliers on ${item}`);
      }

      return (
        filtered.map((i) => {
          return { itemAmount: BigInt(i.amount), money: BigInt(i.money), soldAt: i.date };
        }) || q
      );
    });

  const itemCount = await prisma.graphMetrics.findMany({
    where: {
      AND: [{ category: "item-count-" + item }, { userId: "global" }],
    },
  });

  const value = await prisma.graphMetrics.findMany({
    where: {
      AND: [{ category: "item-value-" + item }, { userId: "global" }],
    },
  });

  if (orders.length < 2 && offers.length < 2 && itemCount.length < 2 && value.length < 2) {
    const result = "not enough data" as const;
    await redis.set(`cache:item:history:${item}`, JSON.stringify(result), "EX", ms("6h") / 1000);
    return result;
  }

  const auctionAverages = new Map<string, number[]>();

  for (const item of orders) {
    const date = dayjs(item.date).format("YYYY-MM-DD");

    if (auctionAverages.has(date)) {
      auctionAverages
        .get(date)
        ?.push(...new Array(Number(item.itemAmount)).fill(Number(item.price)));
    } else {
      auctionAverages.set(date, new Array(Number(item.itemAmount)).fill(Number(item.price)));
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

  const itemValues = new Map<string, number>();

  for (const item of value) {
    itemValues.set(dayjs(item.date).format("YYYY-MM-DD"), Number(item.value));
  }

  const labels: string[] = [];
  const datasets: ProcessedGraphData["datasets"] = [
    { label: "market", data: [] },
    { label: "offers", data: [] },
    { label: "worth", data: [] },
    { label: "items in world", data: [] },
  ];

  // Collect all unique dates
  for (const key of auctionAverages.keys()) {
    const dateStr = dayjs(key).format("YYYY-MM-DD");
    if (!labels.includes(dateStr)) labels.push(dateStr);
  }
  for (const key of offerAverages.keys()) {
    const dateStr = dayjs(key).format("YYYY-MM-DD");
    if (!labels.includes(dateStr)) labels.push(dateStr);
  }
  for (const i of itemCount) {
    const dateStr = dayjs(i.date).format("YYYY-MM-DD");
    if (!labels.includes(dateStr)) labels.push(dateStr);
  }
  for (const i of value) {
    const dateStr = dayjs(i.date).format("YYYY-MM-DD");
    if (!labels.includes(dateStr)) labels.push(dateStr);
  }

  // Sort dates
  inPlaceSort(labels).asc((i) => dayjs(i, "YYYY-MM-DD").unix());

  // Fill gaps in dates
  for (let i = 0; i < labels.length; i++) {
    if (!labels[i + 1]) break;
    const date1 = dayjs(labels[i], "YYYY-MM-DD");
    const date2 = dayjs(labels[i + 1], "YYYY-MM-DD");
    if (!date1.add(1, "day").isSame(date2)) {
      labels.splice(i + 1, 0, date1.add(1, "day").format("YYYY-MM-DD"));
    }
  }

  // Populate dataset data
  for (let i = 0; i < labels.length; i++) {
    const dateString = labels[i];

    // Market
    if (auctionAverages.has(dateString)) {
      const values = auctionAverages.get(dateString)!;
      datasets[0].data.push(Math.floor(values.reduce((a, b) => a + b) / values.length));
    } else if (i > 0) {
      datasets[0].data.push(datasets[0].data[i - 1]);
    } else {
      datasets[0].data.push(0);
    }

    // Offers
    if (offerAverages.has(dateString)) {
      const values = offerAverages.get(dateString)!;
      datasets[1].data.push(Math.floor(values.reduce((a, b) => a + b) / values.length));
    } else if (i > 0) {
      datasets[1].data.push(datasets[1].data[i - 1]);
    } else {
      datasets[1].data.push(0);
    }

    // Item counts
    if (itemCounts.has(dateString)) {
      datasets[3].data.push(itemCounts.get(dateString)!);
    } else if (i > 0) {
      datasets[3].data.push(datasets[3].data[i - 1]);
    } else {
      datasets[3].data.push(0);
    }

    // Item values
    if (itemValues.has(dateString)) {
      datasets[2].data.push(itemValues.get(dateString)!);
    } else if (i > 0) {
      datasets[2].data.push(datasets[2].data[i - 1]);
    } else {
      datasets[2].data.push(0);
    }
  }

  const result = { labels, datasets };
  await redis.set(`cache:item:history:${item}`, JSON.stringify(result), "EX", ms("6h") / 1000);
  return result;
}

function filterDataByDays(data: ProcessedGraphData, days: number): ProcessedGraphData {
  const targetStartDate = dayjs().subtract(days + 1, "days");

  let startIndex = 0;
  for (let i = 0; i < data.labels.length; i++) {
    if (!dayjs(data.labels[i]).isBefore(targetStartDate)) {
      startIndex = i;
      break;
    }
  }

  return {
    labels: data.labels.slice(startIndex),
    datasets: data.datasets.map((ds) => ({
      ...ds,
      data: ds.data.slice(startIndex),
    })),
  };
}

function buildCharts(data: ProcessedGraphData): {
  priceData: ChartConfiguration;
  itemCountData: ChartConfiguration;
} {
  const datasetStyles = [
    { fill: false, borderColor: "#0ea5e933", backgroundColor: "#0ea5e911" }, // market
    { fill: false, borderColor: "#f43f5e33", backgroundColor: "#f43f5e11" }, // offers
    { fill: false, borderColor: "#d946ef", backgroundColor: "#d946ef44" }, // worth
    { fill: true, borderColor: "#8b5cf666", backgroundColor: "#8b5cf633" }, // items in world
  ];

  const priceChart: ChartConfiguration = {
    type: "line",
    data: {
      labels: data.labels,
      datasets: data.datasets.slice(0, 3).map((ds, idx) => ({
        label: ds.label,
        data: ds.data,
        ...datasetStyles[idx],
      })),
    },
  };

  const itemCountChart: ChartConfiguration = {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: data.datasets[3].label,
          data: data.datasets[3].data,
          ...datasetStyles[3],
        },
      ],
    },
  };

  return { priceData: priceChart, itemCountData: itemCountChart };
}

export default async function getItemHistoryData(items: Item[], item: string, days = 30) {
  if (!items.find((i) => i.id === item)) return "invalid item";

  const rawData = await getRawData(item);

  if (typeof rawData === "string") {
    return rawData;
  }

  const filteredData = filterDataByDays(rawData, days);
  return buildCharts(filteredData);
}
