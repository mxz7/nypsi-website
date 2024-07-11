import prisma from "$lib/server/database";
import type { ChartConfiguration } from "chart.js";
import dayjs from "dayjs";
import { sort } from "fast-sort";

export const config = {
  isr: {
    expiration: 3600,
    allowQuery: ["days"],
  },
};

export async function load({ url }) {
  const days = parseInt(url.searchParams.get("days") || "30") || 30;

  return {
    queryGraph: await getDatabaseQueries(days),
    usersCommandsGraph: await getActiveUsersAndCommands(days),
  };
}

async function getData(key: string, days: number) {
  const query = await prisma.botMetrics.findMany({
    where: {
      AND: [{ category: key }, { createdAt: { gt: dayjs().subtract(days, "days").toDate() } }],
    },
    select: {
      createdAt: true,
      value: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return query;
}

function getLabels(...dates: Date[][]) {
  const labels: string[] = [];

  for (const datesGroup of dates) {
    for (const date of datesGroup) {
      const formatted = dayjs(date).set("minutes", 0).set("seconds", 0).format("YYYY-MM-DD HH:mm");

      if (!labels.includes(formatted)) labels.push(formatted);
    }
  }

  return sort(labels).asc((i) => dayjs(i).valueOf());
}

function calculateMovingAverage(data: { x: number; y: number }[], windowSize: number) {
  const movingAverageData = [];
  for (let i = 0; i < data.length; i++) {
    if (i < windowSize - 1) {
      movingAverageData.push({ x: data[i].x, y: null });
    } else {
      let sum = 0;
      for (let j = 0; j < windowSize; j++) {
        sum += data[i - j].y;
      }
      const average = sum / windowSize;
      movingAverageData.push({ x: data[i].x, y: average });
    }
  }
  return movingAverageData;
}

async function getDatabaseQueries(days: number) {
  const queryGraph: ChartConfiguration = {
    type: "scatter",
    data: {
      labels: [],
      datasets: [
        {
          yAxisID: "1",
          label: "average query time",
          data: [],
          fill: false,
          borderColor: "#8b5cf677",
          backgroundColor: "#8b5cf677",
          radius: 1.3,
        },
        {
          yAxisID: "2",
          label: "hourly queries",
          data: [],
          fill: false,
          borderColor: "#1e293b",
          backgroundColor: "#1e293b",
          radius: 1.3,
        },
        {
          yAxisID: "1",
          label: "query time average",
          data: [],
          type: "line",
          fill: false,
          borderColor: "#8b5cf6",
          borderWidth: 3,
          pointRadius: 0,
        },
        {
          yAxisID: "2",
          label: "hourly query average",
          data: [],
          type: "line",
          fill: false,
          borderColor: "#1e293b",
          borderWidth: 3,
          pointRadius: 0,
        },
      ],
    },
  };

  const [queryTime, queryCount] = await Promise.all([
    getData("hourly_query_time", days),
    getData("hourly_query", days),
  ]);

  queryGraph.data.labels = [];

  for (const datesGroup of [
    queryTime.map((i) => i.createdAt),
    queryCount.map((i) => i.createdAt),
  ]) {
    for (const date of datesGroup) {
      if (
        !queryGraph.data.labels.includes(
          dayjs(date).set("minutes", 0).set("seconds", 0).set("ms", 0).valueOf(),
        )
      )
        queryGraph.data.labels.push(
          dayjs(date).set("minutes", 0).set("seconds", 0).set("ms", 0).valueOf(),
        );
    }
  }

  for (const query of queryTime) {
    const labelIndex = queryGraph.data.labels.indexOf(
      dayjs(query.createdAt).set("minutes", 0).set("seconds", 0).set("ms", 0).valueOf(),
    );

    if (labelIndex === -1) continue;

    queryGraph.data.datasets[0].data.push({
      x: dayjs(query.createdAt).set("minutes", 0).set("seconds", 0).set("ms", 0).valueOf(),
      y: query.value,
    });
  }

  for (const query of queryCount) {
    const labelIndex = queryGraph.data.labels.indexOf(
      dayjs(query.createdAt).set("minutes", 0).set("seconds", 0).set("ms", 0).valueOf(),
    );

    if (labelIndex === -1) continue;

    queryGraph.data.datasets[1].data.push({
      x: dayjs(query.createdAt).set("minutes", 0).set("seconds", 0).set("ms", 0).valueOf(),
      y: query.value,
    });
  }

  queryGraph.data.datasets[2].data = calculateMovingAverage(
    queryGraph.data.datasets[0].data as { x: number; y: number }[],
    15,
  );

  queryGraph.data.datasets[3].data = calculateMovingAverage(
    queryGraph.data.datasets[1].data as { x: number; y: number }[],
    15,
  );

  return queryGraph;
}

async function getActiveUsersAndCommands(days: number) {
  const graph: ChartConfiguration = {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          yAxisID: "1",
          label: "active users",
          data: [],
          fill: false,
          borderColor: "#8b5cf6",
          backgroundColor: "#8b5cf6",
        },
        {
          yAxisID: "2",
          label: "commands",
          data: [],
          fill: false,
          borderColor: "#1e293b",
          backgroundColor: "#1e293b",
        },
      ],
    },
  };

  const [users, commands] = await Promise.all([
    getData("daily_active_users", days),
    getData("daily_commands", days),
  ]);

  graph.data.labels = getLabels(
    users.map((i) => dayjs(i.createdAt).set("hours", 0).toDate()),
    commands.map((i) => dayjs(i.createdAt).set("hours", 0).toDate()),
  );

  for (const query of users) {
    const formattedDate = dayjs(query.createdAt)
      .set("minutes", 0)
      .set("seconds", 0)
      .set("hours", 0)
      .format("YYYY-MM-DD HH:mm");

    const labelIndex = graph.data.labels.indexOf(formattedDate);

    if (labelIndex === -1) continue;

    graph.data.datasets[0].data.push(query.value);
  }

  for (const query of commands) {
    const formattedDate = dayjs(query.createdAt)
      .set("minutes", 0)
      .set("seconds", 0)
      .set("hours", 0)
      .format("YYYY-MM-DD HH:mm");

    const labelIndex = graph.data.labels.indexOf(formattedDate);

    if (labelIndex === -1) continue;

    graph.data.datasets[1].data.push(query.value);
  }

  return graph;
}
