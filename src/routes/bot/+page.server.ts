import prisma from "#lib/server/database.js";
import { RedisCache } from "#lib/server/cache.js";
import type { ChartData } from "#lib/types/chart.js";
import dayjs from "dayjs";
import { sort } from "fast-sort";

type BotCharts = {
  queryGraph: ChartData;
  usersCommandsGraph: ChartData;
  preprocessGraph: ChartData;
  gamesGraph: ChartData;
};

const botChartCache = new RedisCache<BotCharts>("cache:bot_metrics:v2", 3600);

export async function load({ url }) {
  const days = parseInt(url.searchParams.get("days") || "30") || 30;

  const cache = await botChartCache.get(String(days));

  if (cache) {
    return cache;
  }

  const data = {
    queryGraph: await getDatabaseQueries(days),
    usersCommandsGraph: await getActiveUsersAndCommands(days),
    preprocessGraph: await getPreprocess(days),
    gamesGraph: await getGamesByType(days),
  };

  await botChartCache.set(String(days), data);

  return data;
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
  const queryGraph: ChartData = {
    kind: "scatter",
    labels: [],
    series: [
      {
        label: "average query time",
        data: [],
        fill: false,
        color: "#8b5cf677",
        fillColor: "#8b5cf677",
        pointRadius: 1.3,
      },
      {
        axis: "right",
        label: "hourly queries",
        data: [],
        fill: false,
        color: "#1e293b",
        fillColor: "#1e293b",
        pointRadius: 1.3,
      },
      {
        label: "query time average",
        data: [],
        kind: "line",
        fill: false,
        color: "#8b5cf6",
        width: 3,
        pointRadius: 0,
      },
      {
        axis: "right",
        label: "hourly query average",
        data: [],
        kind: "line",
        fill: false,
        color: "#1e293b",
        width: 3,
        pointRadius: 0,
      },
    ],
  };

  const [queryTime, queryCount] = await Promise.all([
    getData("hourly_query_time", days),
    getData("hourly_query", days),
  ]);

  queryGraph.labels = [];

  for (const datesGroup of [
    queryTime.map((i) => i.createdAt),
    queryCount.map((i) => i.createdAt),
  ]) {
    for (const date of datesGroup) {
      if (
        !queryGraph.labels.includes(
          dayjs(date).set("minutes", 0).set("seconds", 0).set("ms", 0).valueOf(),
        )
      )
        queryGraph.labels.push(
          dayjs(date).set("minutes", 0).set("seconds", 0).set("ms", 0).valueOf(),
        );
    }
  }

  for (const query of queryTime) {
    const labelIndex = queryGraph.labels.indexOf(
      dayjs(query.createdAt).set("minutes", 0).set("seconds", 0).set("ms", 0).valueOf(),
    );

    if (labelIndex === -1) continue;

    queryGraph.series[0].data.push({
      x: dayjs(query.createdAt).set("minutes", 0).set("seconds", 0).set("ms", 0).valueOf(),
      y: query.value,
    });
  }

  for (const query of queryCount) {
    const labelIndex = queryGraph.labels.indexOf(
      dayjs(query.createdAt).set("minutes", 0).set("seconds", 0).set("ms", 0).valueOf(),
    );

    if (labelIndex === -1) continue;

    queryGraph.series[1].data.push({
      x: dayjs(query.createdAt).set("minutes", 0).set("seconds", 0).set("ms", 0).valueOf(),
      y: query.value,
    });
  }

  queryGraph.series[2].data = calculateMovingAverage(
    queryGraph.series[0].data as { x: number; y: number }[],
    15,
  );

  queryGraph.series[3].data = calculateMovingAverage(
    queryGraph.series[1].data as { x: number; y: number }[],
    15,
  );

  return queryGraph;
}

async function getActiveUsersAndCommands(days: number) {
  const graph: ChartData = {
    kind: "line",
    labels: [],
    series: [
      {
        label: "active users",
        data: [],
        fill: false,
        color: "#8b5cf6",
        fillColor: "#8b5cf6",
      },
      {
        axis: "right",
        label: "commands",
        data: [],
        fill: false,
        color: "#1e293b",
        fillColor: "#1e293b",
      },
    ],
  };

  const [users, commands] = await Promise.all([
    getData("daily_active_users", days),
    getData("daily_commands", days),
  ]);

  graph.labels = getLabels(
    users.map((i) => dayjs(i.createdAt).set("hours", 0).toDate()),
    commands.map((i) => dayjs(i.createdAt).set("hours", 0).toDate()),
  );

  const usersByDay = new Map(
    users.map((entry) => [
      dayjs(entry.createdAt).startOf("day").format("YYYY-MM-DD HH:mm"),
      entry.value,
    ]),
  );
  const commandsByDay = new Map(
    commands.map((entry) => [
      dayjs(entry.createdAt).startOf("day").format("YYYY-MM-DD HH:mm"),
      entry.value,
    ]),
  );

  graph.series[0].data = graph.labels.map((label) => usersByDay.get(String(label)) ?? null);
  graph.series[1].data = graph.labels.map((label) => commandsByDay.get(String(label)) ?? null);

  return graph;
}

async function getPreprocess(days: number) {
  const queryGraph: ChartData = {
    kind: "scatter",
    labels: [],
    series: [
      {
        label: "average preprocess time",
        data: [],
        fill: false,
        color: "#8b5cf677",
        fillColor: "#8b5cf677",
        pointRadius: 1.3,
      },
      {
        axis: "right",
        label: "hourly commands",
        data: [],
        fill: false,
        color: "#1e293b",
        fillColor: "#1e293b",
        pointRadius: 1.3,
      },
      {
        label: "preprocess time average",
        data: [],
        kind: "line",
        fill: false,
        color: "#8b5cf6",
        width: 3,
        pointRadius: 0,
      },
      {
        axis: "right",
        label: "hourly commands average",
        data: [],
        kind: "line",
        fill: false,
        color: "#1e293b",
        width: 3,
        pointRadius: 0,
      },
    ],
  };

  const [queryTime, queryCount] = await Promise.all([
    getData("hourly_preprocess_time", days),
    getData("hourly_preprocess", days),
  ]);

  queryGraph.labels = [];

  for (const datesGroup of [
    queryTime.map((i) => i.createdAt),
    queryCount.map((i) => i.createdAt),
  ]) {
    for (const date of datesGroup) {
      if (
        !queryGraph.labels.includes(
          dayjs(date).set("minutes", 0).set("seconds", 0).set("ms", 0).valueOf(),
        )
      )
        queryGraph.labels.push(
          dayjs(date).set("minutes", 0).set("seconds", 0).set("ms", 0).valueOf(),
        );
    }
  }

  for (const query of queryTime) {
    const labelIndex = queryGraph.labels.indexOf(
      dayjs(query.createdAt).set("minutes", 0).set("seconds", 0).set("ms", 0).valueOf(),
    );

    if (labelIndex === -1) continue;

    queryGraph.series[0].data.push({
      x: dayjs(query.createdAt).set("minutes", 0).set("seconds", 0).set("ms", 0).valueOf(),
      y: query.value,
    });
  }

  for (const query of queryCount) {
    const labelIndex = queryGraph.labels.indexOf(
      dayjs(query.createdAt).set("minutes", 0).set("seconds", 0).set("ms", 0).valueOf(),
    );

    if (labelIndex === -1) continue;

    queryGraph.series[1].data.push({
      x: dayjs(query.createdAt).set("minutes", 0).set("seconds", 0).set("ms", 0).valueOf(),
      y: query.value,
    });
  }

  queryGraph.series[2].data = calculateMovingAverage(
    queryGraph.series[0].data as { x: number; y: number }[],
    15,
  );

  queryGraph.series[3].data = calculateMovingAverage(
    queryGraph.series[1].data as { x: number; y: number }[],
    15,
  );

  return queryGraph;
}

async function getGamesByType(days: number) {
  const graph: ChartData = {
    kind: "line",
    labels: [],
    series: [],
  };

  const fromDate = dayjs().subtract(days, "days").startOf("day").toDate();

  // Use a DB-side aggregation for performance: count per game per day
  const rows: { game: string; day: Date; cnt: number }[] = await prisma.$queryRaw`
    SELECT "game", date_trunc('day', "date") AS day, COUNT(*) AS cnt
    FROM "Game"
    WHERE "date" > ${fromDate}
    GROUP BY "game", day
    ORDER BY day ASC, "game" ASC
  `;

  if (!rows || rows.length === 0) return graph;

  // collect labels (days as numeric timestamps) and types
  const labelSet = new Set<number>();
  const typesSet = new Set<string>();

  for (const r of rows) {
    const labelNum = dayjs(r.day).startOf("day").valueOf();
    labelSet.add(labelNum);
    typesSet.add(r.game);
  }

  const labels = Array.from(labelSet).sort((a, b) => a - b);
  const types = Array.from(typesSet).slice(0, 25);

  graph.labels = labels;

  const colors = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#84cc16",
    "#10b981",
    "#06b6d4",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#64748b",
  ];

  // map counts by type+label (label as numeric timestamp)
  const counts: Record<string, Record<number, number>> = {};
  for (const r of rows) {
    const labelNum = dayjs(r.day).startOf("day").valueOf();
    counts[r.game] = counts[r.game] || {};
    counts[r.game][labelNum] = Number(r.cnt || 0);
  }

  for (let i = 0; i < types.length; i++) {
    const t = types[i];

    const dataset = {
      label: t,
      data: (labels as number[]).map((l) => ({ x: l, y: counts[t]?.[l] || 0 })),
      fill: false,
      color: colors[i % colors.length],
      fillColor: colors[i % colors.length],
    };

    graph.series.push(dataset);
  }

  return graph;
}
