import { describe, expect, it } from "vitest";

import { prepareChart } from "../src/lib/functions/chart/chart-data.js";
import type { ChartData } from "../src/lib/types/chart.js";

describe("prepareChart", () => {
  it("aligns sparse scatter series by timestamp without changing tooltip values", () => {
    const chart: ChartData = {
      kind: "scatter",
      labels: [100, 200, 300],
      series: [
        {
          label: "latency",
          data: [
            { x: 300, y: 20 },
            { x: 100, y: 10 },
          ],
        },
        {
          label: "queries",
          axis: "right",
          data: [
            { x: 200, y: 10_000 },
            { x: 100, y: 5_000 },
          ],
        },
      ],
    };
    const original = structuredClone(chart);
    const plot = prepareChart(chart);

    expect(plot.rows).toEqual([
      { x: 100, label: 100, values: { 0: 10, 1: 5_000 } },
      { x: 200, label: 200, values: { 1: 10_000 } },
      { x: 300, label: 300, values: { 0: 20 } },
    ]);
    expect(plot.series[0].points.map((point) => point.y)).toEqual([0.5, 1]);
    expect(plot.series[1].points.map((point) => point.y)).toEqual([0.5, 1]);
    expect(plot.leftDomain).toEqual([0, 20]);
    expect(plot.rightDomain).toEqual([0, 10_000]);
    expect(chart).toEqual(original);
  });

  it("keeps missing and non-finite values as gaps instead of plotting zero", () => {
    const plot = prepareChart({
      kind: "line",
      labels: ["Monday", "Tuesday", "Wednesday", "Thursday"],
      series: [{ label: "average", data: [null, 0, NaN, 10] }],
    });

    expect(plot.series[0].points.map((point) => point.y)).toEqual([null, 0, null, 1]);
    expect(plot.rows.map((row) => row.values)).toEqual([{}, { 0: 0 }, {}, { 0: 10 }]);
    expect(plot.rows.map((row) => row.label)).toEqual([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
    ]);
  });

  it("rescales visible series when a legend entry is hidden", () => {
    const plot = prepareChart(
      {
        kind: "line",
        labels: ["day"],
        series: [
          { label: "small", data: [5] },
          { label: "large", data: [1_000] },
        ],
      },
      new Set([1]),
    );

    expect(plot.leftDomain).toEqual([0, 5]);
    expect(plot.series[0].points[0].y).toBe(1);
    expect(plot.xDomain[0]).toBeLessThan(plot.xDomain[1]);
  });

  it("keeps empty, zero-only, and negative charts on valid domains", () => {
    for (const values of [[], [0], [-10, 10]]) {
      const plot = prepareChart({
        kind: "line",
        labels: ["first", "second"],
        series: [{ label: "value", data: values }],
      });

      expect(plot.leftDomain[0]).toBeLessThan(plot.leftDomain[1]);
      expect(plot.xDomain[0]).toBeLessThan(plot.xDomain[1]);
      expect(plot.series[0].points.every((point) => Number.isFinite(point.y))).toBe(true);
    }
  });
});
