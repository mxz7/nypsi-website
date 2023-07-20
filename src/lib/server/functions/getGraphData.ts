import prisma from '$lib/server/database.js';
import type { Item } from '$lib/types/Item';
import type { ChartConfiguration } from 'chart.js';
import dayjs from 'dayjs';
import { inPlaceSort } from 'fast-sort';

export default async function getGraphData(categories: string[], user: string, items: Item[]) {
  if (!user || !user.match(/^\d{17,19}$/)) return 'invalid user';

  const results = new Map<string, { date: Date; value: bigint }[]>();

  for (const category of categories) {
    results.set(
      category,
      await prisma.graphMetrics.findMany({
        where: {
          AND: [
            { userId: user },
            { date: { gte: dayjs().subtract(60, 'days').toDate() } },
            { category: category },
          ],
        },
        select: {
          date: true,
          value: true,
        },
      })
    );
  }

  if (categories.length === 1 && Array.from(results.values())[0].length < 3)
    return 'not enough data';

  const graphData: ChartConfiguration = {
    type: 'line',
    data: {
      labels: [],
      datasets: [],
    },
  };

  if (results.size === 1) {
    graphData.data.datasets.push({
      yAxisID: 'y1',
      label: categories[0].includes('item')
        ? items.find((i) => i.id === categories[0].split('-')[2]).name
        : await prisma.user
            .findUnique({
              where: { id: user },
              select: { lastKnownUsername: true },
            })
            .then((q) => q?.lastKnownUsername || ''),
      data: [],
      fill: true,
      borderColor: '#8b5cf6',
      backgroundColor: '#8b5cf644',
    });
  } else {
    for (const [key] of results.entries()) {
      graphData.data.datasets.push({
        yAxisID: 'y1',
        label: items.find((i) => i.id === key.split('-')[2]).name,
        data: [],
        fill: true,
      });
    }
  }

  for (const result of results.values()) {
    for (const i of result) {
      if (!graphData.data.labels.includes(dayjs(i.date).format('YYYY-MM-DD')))
        graphData.data.labels.push(dayjs(i.date).format('YYYY-MM-DD'));
    }
  }

  inPlaceSort(graphData.data.labels as string[]).asc((i) => dayjs(i, 'YYYY-MM-DD').unix());

  // ensures theres a label for every day
  for (let i = 0; i < graphData.data.labels.length; i++) {
    if (!graphData.data.labels[i + 1]) break;

    const date1 = dayjs(graphData.data.labels[i] as string, 'YYYY-MM-DD');
    const date2 = dayjs(graphData.data.labels[i + 1] as string, 'YYYY-MM-DD');

    if (!date1.add(1, 'day').isSame(date2)) {
      graphData.data.labels.splice(i + 1, 0, date1.add(1, 'day').format('YYYY-MM-DD'));
    }
  }

  for (const dateString of graphData.data.labels as string[]) {
    for (const [key, value] of results.entries()) {
      if (value.find((i) => dayjs(i.date).format('YYYY-MM-DD') === dateString)) {
        if (graphData.data.datasets.length > 1) {
          graphData.data.datasets
            .find((i) => i.label === items.find((i) => i.id === key.split('-')[2]).name)
            .data.push(
              Number(value.find((i) => dayjs(i.date).format('YYYY-MM-DD') === dateString).value)
            );
        } else {
          graphData.data.datasets[0].data.push(
            Number(value.find((i) => dayjs(i.date).format('YYYY-MM-DD') === dateString).value)
          );
        }
      } else {
        if (graphData.data.datasets.length > 1) {
          graphData.data.datasets
            .find((i) => i.label === items.find((i) => i.id === key.split('-')[2]).name)
            .data.push(0);
        } else {
          graphData.data.datasets[0].data.push(0);
        }
      }
    }
  }

  return graphData;
}
