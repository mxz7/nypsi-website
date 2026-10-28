import type { ChartData } from "#lib/types/chart.js";
import { scaleLinear } from "d3-scale";

const colors = ["#8b5cf6", "#0ea5e9", "#f43f5e", "#10b981", "#f59e0b", "#ec4899"];

export interface PlotPoint {
  x: number;
  y: number | null;
  value: number | null;
}

export interface ChartRow {
  x: number;
  label: string | number;
  values: Record<number, number>;
}

/** Align series by X, preserving null gaps and each axis's independent units. */
export function prepareChart(data: ChartData, hidden: ReadonlySet<number> = new Set()) {
  const rows = new Map<number, ChartRow>();
  const series = data.series.map((series, index) => {
    const points = series.data
      .map((value, pointIndex) => {
        const label = data.labels[pointIndex] ?? pointIndex;
        const x =
          typeof value === "object" && value !== null
            ? value.x
            : typeof label === "number"
              ? label
              : pointIndex;
        const raw = typeof value === "object" && value !== null ? value.y : value;
        const number = typeof raw === "number" && Number.isFinite(raw) ? raw : null;
        let row = rows.get(x);

        if (!row) {
          row = { x, label: typeof value === "object" && value !== null ? x : label, values: {} };
          rows.set(x, row);
        }

        if (number !== null) row.values[index] = number;

        return { x, y: number, value: number };
      })
      .sort((a, b) => a.x - b.x);

    return {
      ...series,
      index,
      color: series.color ?? colors[index % colors.length],
      points,
      baseline: 0,
    };
  });

  function axisDomain(axis: "left" | "right") {
    let min = 0;
    let max = 0;

    for (const entry of series) {
      if (hidden.has(entry.index) || (entry.axis ?? "left") !== axis) continue;

      for (const point of entry.points) {
        if (point.value === null) continue;

        min = Math.min(min, point.value);
        max = Math.max(max, point.value);
      }
    }

    return scaleLinear()
      .domain(min === max ? [0, 1] : [min, max])
      .nice()
      .domain();
  }

  const leftDomain = axisDomain("left");
  const rightDomain = axisDomain("right");

  // Share plot coordinates while keeping axis labels and tooltip values in their original units.
  for (const entry of series) {
    const scale = scaleLinear().domain(entry.axis === "right" ? rightDomain : leftDomain);

    entry.baseline = scale(0);

    for (const point of entry.points) {
      point.y = point.value === null ? null : scale(point.value);
    }
  }

  const sortedRows = [...rows.values()].sort((a, b) => a.x - b.x);
  const minX = sortedRows[0]?.x ?? 0;
  const maxX = sortedRows.at(-1)?.x ?? 1;

  return {
    series,
    rows: sortedRows,
    leftDomain,
    rightDomain,
    leftTicks: scaleLinear().domain(leftDomain).ticks(5),
    rightTicks: scaleLinear().domain(rightDomain).ticks(5),
    xDomain: minX === maxX ? [minX - 0.5, maxX + 0.5] : [minX, maxX],
    hasRightAxis: series.some((entry) => entry.axis === "right"),
  };
}
