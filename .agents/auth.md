# Auth

- Session cookie: `auth_session`; validated by [`src/lib/server/auth/sessions.ts`](../src/lib/server/auth/sessions.ts)
- In server routes/loaders: `locals.auth` → `{ user, session }` or undefined
- Auth state on client: `auth.value` from [`src/lib/state.svelte.ts`](../src/lib/state.svelte.ts)
- Auth remote functions: [`src/lib/api/auth.remote.ts`](../src/lib/api/auth.remote.ts) — prefer using remote functions where possible, `+page(.server).ts` files will not be necessary with them
