import { afterEach, describe, expect, it, vi } from "vitest";

import sleep from "../src/lib/functions/sleep";

describe("sleep", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("resolves after the requested delay", async () => {
    vi.useFakeTimers();
    const result = sleep(250);

    await vi.advanceTimersByTimeAsync(249);
    let resolved = false;
    void result.then(() => {
      resolved = true;
    });
    await Promise.resolve();
    expect(resolved).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    await expect(result).resolves.toBe(true);
  });
});
