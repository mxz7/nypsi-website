import type { DiscordGuild } from "$lib/types/Discord";

export function canModifyGuild(guild: DiscordGuild) {
  return (parseInt(guild.permissions) & 0x20) == 0x20;
}
