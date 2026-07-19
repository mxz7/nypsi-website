import { describe, expect, it } from "vitest";

import { formatNumberPretty, pluralize } from "../src/lib/functions/string";

describe("pluralize", () => {
  it("keeps the singular form for one item", () => {
    expect(pluralize("day", 1)).toBe("day");
  });

  it("uses a regular plural for other quantities", () => {
    expect(pluralize("day", 0)).toBe("days");
    expect(pluralize("day", 2)).toBe("days");
  });

  it("supports an irregular plural", () => {
    expect(pluralize("person", 2, "people")).toBe("people");
  });
});

describe("formatNumberPretty", () => {
  it.each([
    [999, "999"],
    [1_000, "1k"],
    [1_500, "1.5k"],
    [1_000_000, "1m"],
    [2_500_000_000, "2.5b"],
    [3_000_000_000_000, "3t"],
  ])("formats %d as %s", (value, expected) => {
    expect(formatNumberPretty(value)).toBe(expected);
  });
});
