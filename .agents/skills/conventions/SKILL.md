---
name: conventions
description: Covers the required remote-function-only data-access pattern (query/form + Zod + Redis caching), the BigInt caching pitfall, component naming, Svelte 5 runes usage, and the custom Prisma client import path. Use for any work involving src/lib/api/*.remote.ts, caching, data loading, components, or Prisma.
---

# Conventions

## Remote Functions (`src/lib/api/*.remote.ts`)

Remote functions are required for all new feature data access and client/server communication. Do not add `+page.server.ts`, feature `+server.ts` endpoints, form actions, or client fetches to local API routes. Use `query` for reads, `query.live` for streaming data, `form` for progressively enhanced forms, and `command` for imperative mutations.

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

## Structured Redis data — BigInt pitfall

Use `RedisCache<T>` from [`src/lib/server/cache.ts`](../../../src/lib/server/cache.ts) for caches; it handles BigInt serialization internally. Plain `JSON.stringify` throws on Prisma results containing `BigInt` fields.

All structured values sent through Redis must use `redisSerialize` and `redisDeserialize`, including pub/sub messages. Import the codec directly from `src/lib/server/functions/redis-json.ts`; do not re-export it through cache or transport modules. Ordinary cache consumers should continue using `RedisCache<T>` rather than calling the codec directly. Never use plain `JSON.stringify` / `JSON.parse` for structured Redis data.

## API Routes (`src/routes/api/`)

Do not add API routes for feature data access or client/server communication. Existing API routes are reserved for integrations that require an HTTP endpoint, such as webhooks.

## Data Loading

Load feature data directly in components through remote functions. Do not add `+page.ts` or `+page.server.ts` load functions for feature data. Put each operation in `src/lib/api/*.remote.ts` and call it from the component that consumes it.

For `query.live`, make the first yielded SSR snapshot complete enough to render the current view. Pub/sub updates only cover changes received after subscription, so a partial snapshot can leave hydrated state stale until navigation or the next matching update.

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
