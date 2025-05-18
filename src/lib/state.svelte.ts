import type { Tag } from "./functions/tags";
import type { Authed, NotAuthed } from "./types/Auth";
import type { DiscordGuild } from "./types/Discord";
import type { Item, LootPool } from "./types/Item";

export const auth: { value: Authed | NotAuthed | null } = $state({ value: null });

export const guildsData: { value: DiscordGuild[] | null } = $state({ value: null });

export const items: { value: null | Item[] } = $state({ value: null });
export const tags: { value: { [key: string]: Tag } } = $state({ value: null });
export const itemsOdds: { value: { [key: string]: LootPool } } = $state({ value: null }); // literally just used for scratch card odds

export const gameSearchTerm = $state({ value: "" });
export const userSearchTerm = $state({ value: "" });
export const guildSearchTerm = $state({ value: "" });

export const initialLoad = $state({ value: true });
