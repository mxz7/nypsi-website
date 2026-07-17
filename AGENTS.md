# nypsi-website — Agent Instructions

SvelteKit website for [nypsi.xyz](https://nypsi.xyz), a Discord bot platform. Uses Svelte 5 (runes), Prisma 7 + PostgreSQL, Redis caching, Discord OAuth, Tailwind CSS 4 + daisyUI 5.

## Build & Dev Commands

```sh
pnpm dev            # development server
pnpm build          # production build
pnpm check          # type-check (svelte-check + tsc)
pnpm checks         # full checks
pnpm format         # auto-format
npx prisma generate # regenerate Prisma client after schema changes
```

Run `pnpm checks` after making changes to ensure no linting or formatting errors.

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

## Skills — Further Knowledge and Helping Future Agents

Non-obvious, durable knowledge about this project is captured as **skills** under [`.agents/skills/`](.agents/skills/), following the [Agent Skills](https://agentskills.io) open standard: each skill is a directory containing a `SKILL.md` with YAML frontmatter (`name`, `description`) plus instructions. Skills are discovered automatically — no need to maintain an index here.

**This is an evolving system, not a fixed reference.** If you spend time digging up non-obvious information (from the codebase, docs, or the user) that a future agent would benefit from, capture it as a skill:

- If it clearly overlaps with an existing skill, update that skill's `SKILL.md` instead of creating a duplicate.
- Otherwise, create a new directory under `.agents/skills/<skill-name>/SKILL.md` with a clear `name` and a `description` that states what it covers and when to use it (so it surfaces for the right future tasks).
- Update a skill immediately if you change something it describes, and correct or remove notes you notice are stale/wrong even if unrelated to your current task.
- Keep each `SKILL.md` focused and brief; split out `references/`, `scripts/`, or `assets/` subdirectories inside the skill folder if it grows large.

This directory is committed to the repo and shared across any agent/tool working on it – prefer it over a private or tool-specific memory system for anything durable that future agents/contributors should see.
