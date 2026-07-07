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

See [.agents/conventions.md](.agents/conventions.md) and [.agents/auth.md](.agents/auth.md) for remote function patterns, caching, data loading, Svelte 5 usage, Prisma client import, and auth details.

## Further Knowledge and Helping Future Agents

Check [.agents/readme.md](.agents/readme.md) first – it's a maintained index of the other files in that directory. If a file there covers what you're working on, read it before searching the codebase yourself.

If you dedicate time to searching the codebase for non-obvious information, add your findings to an existing file in `.agents/` (if the topic overlaps) or create a new one and add it to the index in `readme.md`. Keep explanations brief and to the point.

Update these files if you are changing details they describe, and correct or remove notes you notice are stale/wrong even if unrelated to your current task.

This directory is committed to the repo and shared across any agent/tool working on it – prefer it over a private or tool-specific memory system for anything durable that future agents/contributors should see.

You may also update this AGENTS.md file directly if you believe something is wrong, shouldn't be here, should be added or if it should be moved to the `.agents` folder.
