import { describe, expect, it } from "vitest";

import filterOutliers from "../src/lib/functions/chart/filter";

function dataPoint(value: number) {
  return { money: value, amount: 1, date: new Date(2026, 0, value) };
}

describe("filterOutliers", () => {
  it("leaves short datasets untouched", () => {
    const values = [dataPoint(3), dataPoint(1), dataPoint(2)];

    expect(filterOutliers(values)).toBe(values);
  });

  it("sorts values and removes points outside the interquartile range", () => {
    const values = [
      ...Array.from({ length: 11 }, (_, index) => dataPoint(index + 1)),
      dataPoint(1_000),
    ];

    expect(filterOutliers(values).map((value) => value.money)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    ]);
  });

  it("uses money multiplied by amount when comparing points", () => {
    const values = Array.from({ length: 12 }, (_, index) => ({
      money: index + 1,
      amount: 2,
      date: new Date(2026, 0, index + 1),
    }));

    expect(filterOutliers(values).map((value) => value.money * value.amount)).toEqual([
      2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24,
    ]);
  });
});
