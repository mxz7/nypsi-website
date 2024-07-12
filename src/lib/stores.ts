import { browser } from "$app/environment";
import type { User } from "lucia";
import { get, writable } from "svelte/store";

export let auth = writable<Authed | NotAuthed | null>();

type Authed = {
  authenticated: true;
  user: User;
};

type NotAuthed = {
  authenticated: false;
};

export async function getClientAuth() {
  if (!browser) return;

  if (navigator.userAgent.includes("bot")) {
    auth.set({ authenticated: false });
    return;
  }

  const res = await fetch("/api/auth").then((r) => r.json());

  if (res.authenticated) {
    auth.set({ authenticated: true, user: res.user });
  } else {
    auth.set({ authenticated: false });
  }
}

export let items = writable();

export let tags = writable<{ [key: string]: { tagId: string; emoji: string; name: string } }>();

export async function getTags(): Promise<{
  [key: string]: { tagId: string; emoji: string; name: string };
}> {
  if (get(tags)) return get(tags);

  const res = await fetch("https://raw.githubusercontent.com/mxz7/nypsi/main/data/tags.json")
    .then((r) => r.text())
    .then((r) => JSON.parse(r));

  tags.set(res);

  return res;
}
