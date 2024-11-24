import type { User } from "lucia";

export type Authed = {
  authenticated: true;
  user: User;
};

export type NotAuthed = {
  authenticated: false;
};
