import type { ChartOptions } from "chart.js";
import { formatNumberPretty } from "../string.js";

export const itemPriceChartOptions: ChartOptions = {
  plugins: {
    tooltip: {
      intersect: false,
      mode: "index",
      callbacks: {
        label(tooltipItem) {
          return `${tooltipItem.dataset.label} average: $${tooltipItem.formattedValue}`;
        },
      },
    },
  },
  maintainAspectRatio: false,
  responsive: true,
  elements: {
    line: {
      tension: 0.15,
    },
    point: {
      radius: 0,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        autoSkip: true,
        maxTicksLimit: 7,
      },
    },
    y: {
      grid: {
        display: false,
      },
      min: 0,
      ticks: {
        callback(tickValue) {
          return `$${formatNumberPretty(Number(tickValue))}`;
        },
      },
    },
  },
};

export const worldItemCountChartOptions: ChartOptions = {
  plugins: {
    tooltip: {
      intersect: false,
      mode: "index",
      callbacks: {
        label(tooltipItem) {
          return `items in world: ${tooltipItem.formattedValue}`;
        },
      },
    },
  },
  maintainAspectRatio: false,
  responsive: true,
  elements: {
    line: {
      tension: 0.15,
    },
    point: {
      radius: 0,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        autoSkip: true,
        maxTicksLimit: 7,
      },
    },
    y: {
      grid: {
        display: false,
      },
      min: 0,
      ticks: {
        callback(tickValue) {
          return formatNumberPretty(Number(tickValue));
        },
      },
    },
  },
};
