import { describe, expect, it } from "vitest";

import parseEmoji from "../src/lib/functions/parseEmoji";

describe("parseEmoji", () => {
  it("returns an empty string when no emoji is provided", () => {
    expect(parseEmoji("")).toBe("");
  });

  it("builds a Discord CDN URL for a custom emoji", () => {
    expect(parseEmoji("<:nypsi:123456789>")).toBe(
      "https://cdn.discordapp.com/emojis/123456789.webp?size=80",
    );
  });

  it("builds a GIF URL for an animated custom emoji", () => {
    expect(parseEmoji("<a:nypsi:123456789>")).toBe(
      "https://cdn.discordapp.com/emojis/123456789.gif?size=80",
    );
  });

  it("builds a Twemoji URL for a Unicode emoji", () => {
    expect(parseEmoji("📦")).toMatch(/\/1f4e6\.svg$/);
  });
});
