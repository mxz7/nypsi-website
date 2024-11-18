import type { Tag } from "./functions/tags";
import type { Authed, NotAuthed } from "./types/Auth";
import type { Item } from "./types/Item";

export const auth: { value: Authed | NotAuthed | null } = $state({ value: null });

export const items: { value: null | Item[] } = $state({ value: null });
export const tags: { value: { [key: string]: Tag } } = $state({ value: null });

export const gameSearchTerm = $state({ value: "" });
export const userSearchTerm = $state({ value: "" });
export const guildSearchTerm = $state({ value: "" });
