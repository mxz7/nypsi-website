import { describe, expect, it } from "vitest";

import { parseTowerRows } from "../src/lib/functions/tower";

const legend = "A = blank | B = egg | C = clicked egg | G = gem | GC = found gem | X = bad click";

function outcome(difficulty: string, rows: string[]) {
  return `difficulty: ${difficulty}\n${legend}\n${rows.join("\n")}`;
}

describe("parseTowerRows", () => {
  it.each([
    ["easy", "CABBA", 5],
    ["medium", "CABB", 4],
    ["hard", "CAB", 3],
    ["expert", "CA", 2],
  ])("uses the recorded %s board width", (difficulty, row, width) => {
    const parsed = parseTowerRows(outcome(difficulty, [row]));

    expect(parsed).toHaveLength(1);
    expect(parsed[0]).toHaveLength(width);
  });

  it("counts a found gem as one cell", () => {
    expect(parseTowerRows(outcome("medium", ["AGCBA"]))).toEqual([["A", "GC", "B", "A"]]);
  });

  it("parses the completed expert board from game 621082 as two columns", () => {
    const rows = ["CA", "AC", "AC", "AC", "CA", "AC", "CA", "AC", "AC"];
    const parsed = parseTowerRows(outcome("expert", rows));

    expect(parsed).toHaveLength(9);
    expect(parsed.every((row) => row.length === 2)).toBe(true);
  });
});
