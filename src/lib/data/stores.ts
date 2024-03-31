import type { User } from "lucia";
import { writable } from "svelte/store";

export const gameSearchTerm = writable("");
export const userSearchTerm = writable("");
export const guildSearchTerm = writable("");
export const auth = writable<{
  authenticated: boolean;
  user?: User;
} | null>();
