# Conventions

## Remote Functions (`src/lib/api/*.remote.ts`)

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

## Caching — BigInt pitfall

Use `RedisCache<T>` from [`src/lib/server/cache.ts`](../src/lib/server/cache.ts) — it handles BigInt serialization internally. Do **not** call `redisSerialize` / `redisDeserialize` directly or use plain `JSON.stringify` on Prisma results, as both will throw on `BigInt` fields.

## API Routes (`src/routes/api/`)

Prefer using Remote Functions if possible over API routes.

## Data Loading

- `+page.ts` — client-side load; use for public data fetched via `fetch`
- `+page.server.ts` — server-only; use for authenticated/private data; access `locals.auth`
- Cascade via `parent()` to get data from layout loads

## Components

Use kebab-case naming for component files.

## Svelte 5 (Runes)

This project uses Svelte 5. Use `$state`, `$derived`, `$effect`, `$props` — not legacy Svelte 4 store patterns.

## Prisma Client Import

The client is generated to a custom path. Import from the generated location, not the default:

```typescript
import prisma from "$lib/server/database";
// NOT: import { PrismaClient } from "@prisma/client"
```
