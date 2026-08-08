import { describe, expect, it } from "vitest";

import { isPrivate } from "../src/lib/server/preferences";

describe("isPrivate", () => {
  it("uses the public default when the sparse preference is absent", () => {
    expect(isPrivate([])).toBe(false);
    expect(isPrivate(null)).toBe(false);
  });

  it("only makes a profile private for an explicit true value", () => {
    expect(isPrivate([{ value: false }])).toBe(false);
    expect(isPrivate([{ value: true }])).toBe(true);
    expect(isPrivate([{ value: "false" }])).toBe(false);
  });
});
