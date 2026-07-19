import { afterEach, describe, expect, it, vi } from "vitest";

import { daysAgo, daysUntil, MStoTime } from "../src/lib/functions/time";

describe("MStoTime", () => {
  it("formats all supported units", () => {
    expect(MStoTime(90_061_000)).toBe("1d 1h 1m 1s");
  });

  it("supports long labels and pluralization", () => {
    expect(MStoTime(176_522_000, { long: true, showSeconds: true })).toBe(
      "2 days 1 hour 2 minutes 2 seconds",
    );
  });

  it("can omit seconds", () => {
    expect(MStoTime(61_000, { showSeconds: false })).toBe("1m");
  });

  it("returns an empty string when there are no visible units", () => {
    expect(MStoTime(0)).toBe("");
    expect(MStoTime(999)).toBe("");
  });
});

describe("relative day helpers", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calculates complete days in the past", () => {
    vi.spyOn(Date, "now").mockReturnValue(new Date("2026-07-19T12:00:00Z").getTime());

    expect(daysAgo(new Date("2026-07-16T11:59:59Z"))).toBe(3);
  });

  it("calculates complete days in the future", () => {
    vi.spyOn(Date, "now").mockReturnValue(new Date("2026-07-19T12:00:00Z").getTime());

    expect(daysUntil(new Date("2026-07-22T12:00:00Z"))).toBe(3);
  });
});
