<!-- Copilot instructions for nypsi-website -->

# Copilot / AI contributor guide

Purpose: give an AI code agent the minimal, actionable knowledge to be productive in this repository.

- Quick start (commands this project expects)
  - Install: `pnpm install` (repository has `pnpm-lock.yaml`).
  - Dev server: `pnpm dev` (runs `vite dev`).
  - Build: `pnpm build` then `pnpm start` to run the Node adapter output.
  - Check types / Svelte: `pnpm check` (runs `svelte-check`).
  - Lint / format: `pnpm lint`, `pnpm format`.

- High-level architecture
  - Frontend + server: SvelteKit app compiled for Node using `@sveltejs/adapter-node`. See [svelte.config.js](svelte.config.js).
  - Database: PostgreSQL accessed via Prisma; generated client output is at `src/generated/prisma` and the schema is at `prisma/schema.prisma`.
  - Cache / transient store: Redis is used via `ioredis` (see `src/lib/server/redis.ts`).
  - Auth: uses `lucia` + Prisma adapters; server auth endpoints live under `src/routes/api/auth`.
  - Logging: `pino` with a file transport in production; logging helpers live in `src/lib/server/logger.ts`.

- Important server-side conventions (do these, not other patterns)
  - Reuse singletons: use `src/lib/server/database.ts` and `src/lib/server/redis.ts` — do NOT create new PrismaClient or Redis instances in other files. Example import: `import prisma from '$lib/server/database'`.
  - Environment: import secrets via `$env/dynamic/private` (not process.env). E.g. `import { env } from "$env/dynamic/private"`.
  - Hooks: `src/hooks.server.ts` sets `event.locals.validate()` and `startTimer`; follow the `event.locals` patterns for request lifecycle data.
  - Remote functions: the project enables SvelteKit experimental `remoteFunctions` (see `svelte.config.js`) — be conservative when changing remote function behavior.

- Database / Prisma notes
  - Prisma generator outputs into `src/generated/prisma` — always run `pnpm prisma generate` after schema edits.
  - Models often use `String` IDs and `BigInt` for counters; check `prisma/schema.prisma` before adding migrations.

- Files and locations to reference when making changes
  - App entry & config: [svelte.config.js](svelte.config.js) and [vite.config.ts](vite.config.ts)
  - DB client: [src/lib/server/database.ts](src/lib/server/database.ts)
  - Redis client: [src/lib/server/redis.ts](src/lib/server/redis.ts)
  - Logging: [src/lib/server/logger.ts](src/lib/server/logger.ts)
  - Request lifecycle: [src/hooks.server.ts](src/hooks.server.ts)
  - Prisma schema: [prisma/schema.prisma](prisma/schema.prisma)

- External dependencies and infra
  - Required environment variables: at minimum `DATABASE_URL` and `REDIS_URL` (used in `database.ts` and `redis.ts`).
  - Production logging writes to `/var/log/nypsi-website/nypsi-website.log` via `pino` (see `logger.ts`).

- PR / change guidelines for automated edits
  - Preserve singletons and shared imports; prefer editing helper modules rather than duplicating logic.
  - If code touches Prisma models, update `prisma/schema.prisma` first and generate the client before changing code that imports models.
  - Run `pnpm check` and `pnpm lint` locally for changes that modify types or UI.

- Examples of common edits
  - Add server helper: put it under `src/lib/server/` and export a default singleton when needed.
  - New API route: add under `src/routes/api/*` and follow existing auth validations by calling `event.locals.validate()`.

If anything here is unclear or you'd like me to expand a section (for example, more sample code snippets for `prisma` usage or common SvelteKit patterns used here), tell me which area to expand.
