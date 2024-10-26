import type { User } from "lucide-svelte";

export type Authed = {
  authenticated: true;
  user: User;
};

export type NotAuthed = {
  authenticated: false;
};
