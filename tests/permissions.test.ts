import { describe, expect, it } from "vitest";

import { canModifyGuild } from "../src/lib/functions/discordapi/permissions";
import type { DiscordGuild } from "../src/lib/types/Discord";

function guildWithPermissions(permissions: string) {
  return { permissions } as DiscordGuild;
}

describe("canModifyGuild", () => {
  it("allows guilds with the manage server permission", () => {
    expect(canModifyGuild(guildWithPermissions("32"))).toBe(true);
  });

  it("allows the permission when combined with other flags", () => {
    expect(canModifyGuild(guildWithPermissions("40"))).toBe(true);
  });

  it("rejects guilds without the manage server permission", () => {
    expect(canModifyGuild(guildWithPermissions("8"))).toBe(false);
  });
});
