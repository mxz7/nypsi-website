import prisma from "$lib/server/database";
import type { ChartConfiguration } from "chart.js";
import dayjs from "dayjs";
import { inPlaceSort } from "fast-sort";

export default async function getGuildData(guild: string, type: "balance" | "xp" | "level") {
  const values = await prisma.graphMetrics.findMany({
    where: {
      AND: [{ category: `guild-${type}` }, { userId: guild }],
    },
    select: {
      value: true,
      date: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  if (values.length < 2) return "not enough data";

  const counts = new Map<string, number>();

  for (const item of values) {
    counts.set(dayjs(item.date).format("YYYY-MM-DD"), Number(item.value));
  }

  const graphData: ChartConfiguration<"line"> = {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          yAxisID: "y1",
          label: type,
          data: [],
          fill: true,
          borderColor: "#8b5cf6",
          backgroundColor: "#8b5cf644",
        },
      ],
    },
  };

  for (const key of counts.keys()) {
    if (!graphData.data.labels.includes(dayjs(key).format("YYYY-MM-DD")))
      graphData.data.labels.push(dayjs(key).format("YYYY-MM-DD"));
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

    if (counts.has(dateString)) {
      graphData.data.datasets[0].data.push(counts.get(dateString));
    } else if (index > 0) {
      graphData.data.datasets[0].data.push(graphData.data.datasets[0].data[index - 1]);
    } else {
      graphData.data.datasets[0].data.push(0);
    }
  }

  return graphData;
}
