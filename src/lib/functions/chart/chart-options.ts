import type { ChartOptions } from "#lib/types/chart.js";
import { formatNumberPretty } from "../string.js";

export const itemPriceChartOptions: ChartOptions = {
  valueFormat: (value) => `$${formatNumberPretty(value)}`,
  tooltipFormat: (value, label) => `${label} average: $${value.toLocaleString()}`,
};

export const worldItemCountChartOptions: ChartOptions = {
  valueFormat: formatNumberPretty,
  tooltipFormat: (value) => `items in world: ${value.toLocaleString()}`,
};
