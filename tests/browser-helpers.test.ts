import { describe, expect, it, vi } from "vitest";

import { getCommandsData, getTopCommands } from "../src/lib/functions/getCommandsData";
import { handleFallbackImage } from "../src/lib/functions/image";

function jsonFetch(value: unknown) {
  return vi.fn(async () => ({
    json: async () => value,
  })) as unknown as typeof fetch;
}

describe("command data helpers", () => {
  const commandData = {
    total: 2,
    users: [
      { username: "one", value: "10", position: 1 },
      { username: "two", value: "5", position: 2 },
    ],
  };

  it("fetches and returns command data", async () => {
    const fetch = jsonFetch(commandData);

    await expect(getCommandsData(fetch)).resolves.toEqual(commandData);
    expect(fetch).toHaveBeenCalledWith("/api/commands");
  });

  it("returns null for incomplete command data", async () => {
    await expect(getCommandsData(jsonFetch({ total: 0, users: [] }))).resolves.toBeNull();
  });

  it("returns the top command users", async () => {
    await expect(getTopCommands(jsonFetch(commandData))).resolves.toEqual(commandData.users);
  });
});

describe("handleFallbackImage", () => {
  it("replaces a failed image with the default Discord avatar", () => {
    const event = { target: { src: "broken-image.png" } };

    handleFallbackImage(event);

    expect(event.target.src).toBe("https://cdn.discordapp.com/embed/avatars/0.png");
  });
});
