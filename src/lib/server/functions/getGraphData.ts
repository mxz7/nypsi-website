import prisma from "$lib/server/database.js";
import type { ChartConfiguration } from "chart.js";
import dayjs from "dayjs";
import { inPlaceSort } from "fast-sort";

export default async function getGraphData(category: string, user: string) {
  if (!user || !user.match(/^\d{17,19}$/)) return "invalid user";

  const userItemCount = await prisma.graphMetrics.findMany({
    where: {
      AND: [
        { userId: user },
        { date: { gte: dayjs().subtract(45, "days").toDate() } },
        { category: category },
      ],
    },
  });

  if (userItemCount.length < 2) return "not enough data";

  const userItemCounts = new Map<string, number>();

  for (const item of userItemCount) {
    userItemCounts.set(dayjs(item.date).format("YYYY-MM-DD"), Number(item.value));
  }

  const graphData: ChartConfiguration = {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          yAxisID: "y1",
          label: await prisma.user
            .findUnique({
              where: { id: user },
              select: { lastKnownUsername: true },
            })
            .then((q) => q?.lastKnownUsername || ""),
          data: [],
          fill: true,
          borderColor: "#8b5cf6",
          backgroundColor: "#8b5cf644",
        },
      ],
    },
  };

  for (const i of userItemCount) {
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
    if (userItemCounts.has(dateString) && userItemCounts.size > 2) {
      graphData.data.datasets[0].data.push(userItemCounts.get(dateString));
    } else if (userItemCounts.size > 2) {
      graphData.data.datasets[0].data.push(0);
    }
  }

  return graphData;
}
