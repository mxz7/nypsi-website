import { browser } from "$app/environment";
import type { Authed, NotAuthed } from "$lib/types/Auth";

export async function getClientAuth(): Promise<Authed | NotAuthed> {
  if (!browser) return;

  if (navigator.userAgent.includes("bot")) {
    return { authenticated: false };
  }

  const res = await fetch("/api/auth").then((r) => r.json());

  if (res.authenticated) {
    return { authenticated: true, user: res.user };
  } else {
    return { authenticated: false };
  }
}
