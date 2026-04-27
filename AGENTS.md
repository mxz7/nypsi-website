# nypsi-website — Agent Instructions

SvelteKit website for [nypsi.xyz](https://nypsi.xyz), a Discord bot platform. Uses Svelte 5 (runes), Prisma 7 + PostgreSQL, Redis caching, Discord OAuth, Tailwind CSS 4 + daisyUI 5.

## Build & Dev Commands

```sh
pnpm dev            # development server
pnpm build          # production build
pnpm check          # type-check (svelte-check + tsc)
pnpm lint           # prettier + eslint check
pnpm format         # auto-format
npx prisma generate # regenerate Prisma client after schema changes
```

## Architecture

```
src/
  lib/
    api/          # Remote functions (*.remote.ts) — server-side data, called from components
    server/       # Server-only: auth/, cache.ts, database.ts, logger.ts
    components/   # Svelte components by category: features/, games/, items/, layout/, ui/, wiki/
    state.svelte.ts  # Global reactive state (Svelte 5 $state runes)
  routes/
    api/          # REST endpoints (+server.ts)
    (auth)/login/ # Discord OAuth flow
    me/, users/, guilds/, games/, items/, leaderboards/, wiki/, ...
prisma/schema.prisma       # DB schema — edit here
src/generated/prisma/      # Generated Prisma client — DO NOT edit manually
```

## Key Conventions

### Remote Functions (`src/lib/api/*.remote.ts`)

Use the `query()` / `form()` wrappers with a Zod schema. Always check Redis cache before hitting the database:

```typescript
export const getUserId = query(z.string().toLowerCase(), async (username) => {
  const cached = await usernameToIdCache.get(username);
  if (cached !== null) return cached;
  const result = await prisma.user.findFirst({ where: { username } });
  await usernameToIdCache.set(username, result);
  return result;
});
```

### Caching — BigInt pitfall

Use `RedisCache<T>` from [`src/lib/server/cache.ts`](src/lib/server/cache.ts) — it handles BigInt serialization internally. Do **not** call `redisSerialize` / `redisDeserialize` directly or use plain `JSON.stringify` on Prisma results, as both will throw on `BigInt` fields.

### API Routes (`src/routes/api/`)

- Prefer using Remote Functions if possible over API routes

### Data Loading

- `+page.ts` — client-side load; use for public data fetched via `fetch`
- `+page.server.ts` — server-only; use for authenticated/private data; access `locals.auth`
- Cascade via `parent()` to get data from layout loads

### Auth

- Session cookie: `auth_session`; validated by [`src/lib/server/auth/sessions.ts`](src/lib/server/auth/sessions.ts)
- In server routes/loaders: `locals.auth` → `{ user, session }` or undefined
- Auth state on client: `auth.value` from [`src/lib/state.svelte.ts`](src/lib/state.svelte.ts)
- Auth remote functions: [`src/lib/api/auth.remote.ts`](src/lib/api/auth.remote.ts) - Prefer using remote functions where possible, +page(.server).ts files will not be necessary with them

### Svelte 5 (Runes)

This project uses Svelte 5. Use `$state`, `$derived`, `$effect`, `$props` — not legacy Svelte 4 store patterns.

## Prisma Client Import

The client is generated to a custom path. Import from the generated location, not the default:

```typescript
import prisma from "$lib/server/database";
// NOT: import { PrismaClient } from "@prisma/client"
```
