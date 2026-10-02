import { form, getRequestEvent, query, requested } from "$app/server";
import {
  deleteSessionCookie,
  getSessionCookie,
  invalidateSession,
  validateSession,
} from "#lib/server/auth/sessions.js";
import { redirect } from "@sveltejs/kit";
import z from "zod";

const getAuth = query(async () => {
  const { cookies, locals } = getRequestEvent();
  if (locals.auth !== undefined) {
    locals.authedUser = locals.auth?.user ?? null;
    return locals.auth;
  }

  const sessionId = getSessionCookie(cookies);
  const validated = sessionId ? await validateSession(sessionId) : null;
  locals.auth = validated;
  locals.authedUser = validated?.user ?? null;
  return validated;
});

export const getAuthedUser = query(async () => {
  const auth = await getAuth();
  return auth?.user ?? null;
});

export const requireAuth = query(
  z
    .string()
    .startsWith("/")
    .refine((path) => !path.startsWith("//") && !path.includes("\\"))
    .optional(),
  async (returnTo) => {
    const user = await getAuthedUser();
    if (!user) {
      const next = returnTo ? `?next=${encodeURIComponent(returnTo)}` : "";
      redirect(303, `/login${next}`);
    }
    return user;
  },
);

export const logOut = form(async () => {
  const auth = await getAuth();
  if (auth?.session) await invalidateSession(auth.session.id);
  deleteSessionCookie(getRequestEvent().cookies);
  getRequestEvent().locals.auth = null;
  getAuth().set(null);
  getAuthedUser().set(null);
  await requested(getAuthedUser, 1).refreshAll();
  redirect(303, "/");
});
