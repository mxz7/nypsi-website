import type { DiscordGuild } from "$lib/types/Discord";

const MANAGER_SERVER = 0x20n;

export function canModifyGuild(guild: DiscordGuild) {
  return (BigInt(guild.permissions) & MANAGER_SERVER) == MANAGER_SERVER;
}
