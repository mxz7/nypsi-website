---
name: auth
description: Explains the session cookie, server-side locals.auth, client-side auth state, and the auth remote functions used for Discord OAuth. Use when reading or checking the authenticated user, or when adding auth-gated routes/remote functions.
---

# Auth

- Session cookie: `auth_session`; validated by [`src/lib/server/auth/sessions.ts`](../../../src/lib/server/auth/sessions.ts)
- In server routes/loaders: `locals.auth` → `{ user, session }`, null after failed validation, or undefined before validation
- Auth state on client: `auth.value` from [`src/lib/state.svelte.ts`](../../../src/lib/state.svelte.ts)
- Mandatory authentication uses `requireAuth()` from `src/lib/api/auth.remote.ts`, optionally with an explicit local path and search (`requireAuth(url.pathname + url.search)`). `getAuthedUser()` remains optional and has no arguments. Neither query reads the request URL. Both share session validation; successful validation populates `locals.auth` and `locals.authedUser` for logging.
- Logout invalidates the session, deletes `auth_session` via `deleteSessionCookie`, clears the session/user query caches, and refreshes requested optional auth queries before redirecting.
- Auth remote functions: [`src/lib/api/auth.remote.ts`](../../../src/lib/api/auth.remote.ts) — prefer using remote functions where possible, `+page(.server).ts` files will not be necessary with them
- Discord OAuth tokens: use [`src/lib/server/auth/discord-tokens.ts`](../../../src/lib/server/auth/discord-tokens.ts). It stores refresh tokens, automatically refreshes expired access tokens, and provides `discordReconnectRequired(url)` for an actionable fallback.
- Discord reconnect flow: `/login?reauthorize=true&next=<path>` permits a signed-in user to reconnect the same Discord account and return to the original page.
