import { describe, expect, it } from "vitest";

import { isPrivate } from "../src/lib/server/preferences";

describe("isPrivate", () => {
  it("uses the private default when the sparse preference is absent", () => {
    expect(isPrivate([])).toBe(true);
    expect(isPrivate(null)).toBe(true);
  });

  it("only makes a profile public for an explicit false value", () => {
    expect(isPrivate([{ value: false }])).toBe(false);
    expect(isPrivate([{ value: true }])).toBe(true);
    expect(isPrivate([{ value: "false" }])).toBe(true);
  });
});
