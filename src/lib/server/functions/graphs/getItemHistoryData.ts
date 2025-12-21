import filterOutliers from "$lib/functions/filterOutliers";
import prisma from "$lib/server/database.js";
import redis from "$lib/server/redis";
import type { Item } from "$lib/types/Item";
import type { ChartConfiguration } from "chart.js";
import dayjs from "dayjs";
import { inPlaceSort } from "fast-sort";
import ms from "ms";

async function getRawData(items: Item[], item: string) {
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

  if (orders.length < 2 && offers.length < 2 && itemCount.length < 2 && value.length < 2)
    return "not enough data";

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

  const graphData: ChartConfiguration = {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          yAxisID: "y1",
          label: "market",
          data: [],
          fill: false,
          borderColor: "#0ea5e933",
          backgroundColor: "#0ea5e911",
        },
        {
          yAxisID: "y1",
          label: "offers",
          data: [],
          fill: false,
          borderColor: "#f43f5e33",
          backgroundColor: "#f43f5e11",
        },
        {
          yAxisID: "y1",
          label: "worth",
          data: [],
          fill: false,
          borderColor: "#d946ef",
          backgroundColor: "#d946ef44",
        },
        {
          yAxisID: "y2",
          label: "items in world",
          data: [],
          fill: true,
          borderColor: "#8b5cf666",
          backgroundColor: "#8b5cf633",
        },
      ],
    },
  };

  for (const key of auctionAverages.keys()) {
    const keyDate = dayjs(key);

    if (!graphData.data.labels.includes(keyDate.format("YYYY-MM-DD"))) {
      graphData.data.labels.push(keyDate.format("YYYY-MM-DD"));
    }
  }

  for (const key of offerAverages.keys()) {
    const keyDate = dayjs(key);

    if (!graphData.data.labels.includes(keyDate.format("YYYY-MM-DD")))
      graphData.data.labels.push(keyDate.format("YYYY-MM-DD"));
  }

  for (const i of itemCount) {
    const date = dayjs(i.date);

    if (!graphData.data.labels.includes(date.format("YYYY-MM-DD"))) {
      graphData.data.labels.push(date.format("YYYY-MM-DD"));
    }
  }

  for (const i of value) {
    const date = dayjs(i.date);

    if (!graphData.data.labels.includes(date.format("YYYY-MM-DD"))) {
      graphData.data.labels.push(date.format("YYYY-MM-DD"));
    }
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
            auctionAverages.get(dateString).length,
        ),
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
            offerAverages.get(dateString).length,
        ),
      );
    } else if (index > 0) {
      graphData.data.datasets[1].data.push(graphData.data.datasets[1].data[index - 1]);
    } else {
      graphData.data.datasets[1].data.push(0);
    }

    if (itemCounts.has(dateString)) {
      graphData.data.datasets[3].data.push(itemCounts.get(dateString));
    } else if (index > 0) {
      graphData.data.datasets[3].data.push(graphData.data.datasets[3].data[index - 1]);
    } else {
      graphData.data.datasets[3].data.push(0);
    }

    if (itemValues.has(dateString)) {
      graphData.data.datasets[2].data.push(itemValues.get(dateString));
    } else if (index > 0) {
      graphData.data.datasets[2].data.push(graphData.data.datasets[2].data[index - 1]);
    } else {
      graphData.data.datasets[2].data.push(0);
    }
  }

  return graphData;
}

function buildPriceChart(fullGraphData: ChartConfiguration): ChartConfiguration {
  const datasets = [0, 1, 2].map((idx) => {
    const dataset = { ...fullGraphData.data.datasets[idx] };
    delete dataset.yAxisID;
    return dataset;
  });

  return {
    type: "line",
    data: {
      labels: fullGraphData.data.labels,
      datasets,
    },
  };
}

function buildItemCountChart(fullGraphData: ChartConfiguration): ChartConfiguration {
  const dataset = { ...fullGraphData.data.datasets[3] };
  delete dataset.yAxisID;

  return {
    type: "line",
    data: {
      labels: fullGraphData.data.labels,
      datasets: [dataset],
    },
  };
}

export default async function getItemHistoryData(items: Item[], item: string, days = 30) {
  if (!items.find((i) => i.id === item)) return "invalid item";

  const cache = await redis.get(`cache:item:history:${item}`);

  let graphData: Awaited<ReturnType<typeof getRawData>>;

  if (cache) {
    graphData = JSON.parse(cache);
  } else {
    graphData = await getRawData(items, item);

    await redis.set(`cache:item:history:${item}`, JSON.stringify(graphData), "EX", ms("6h") / 1000);
  }

  if (typeof graphData === "string") {
    return graphData;
  }

  // +1 needed otherwise some data will start at 0 for some reason
  const targetStartDate = dayjs().subtract(days + 1, "days");

  while (dayjs(graphData.data.labels[0] as string).isBefore(targetStartDate)) {
    graphData.data.labels.shift();
    graphData.data.datasets[0].data.shift();
    graphData.data.datasets[1].data.shift();
    graphData.data.datasets[2].data.shift();
    graphData.data.datasets[3].data.shift();
  }

  return {
    priceData: buildPriceChart(graphData),
    itemCountData: buildItemCountChart(graphData),
  };
}
