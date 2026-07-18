# syntax = docker/dockerfile:1

FROM node:24-slim AS base

WORKDIR /app

FROM base AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI="true"

# install pnpm
RUN corepack enable pnpm

# dependencies
COPY --link .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch && pnpm install --offline --frozen-lockfile

COPY --link prisma ./prisma

RUN pnpm exec prisma generate

COPY --link . .

# Builds sveltekit tsconfig which prisma needs
RUN pnpm exec svelte-kit sync

# Build llms.txt
RUN pnpm exec tsx src/lib/build/llms.ts

RUN pnpm run build
RUN pnpm prune --prod

# Final stage for app image
FROM base

# Copy built application
COPY --chown=node:node --from=build /app/build /app/build
COPY --chown=node:node --from=build /app/node_modules /app/node_modules
COPY --chown=node:node --from=build /app/package.json /app/package.json

# Set production environment
ENV NODE_ENV="production"
ENV ADDRESS_HEADER="cf-connecting-ip"

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD ["node", "-e", "const p=process.env.PORT||3000;fetch('http://127.0.0.1:'+p+'/api/health').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"]

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000

USER node

ENTRYPOINT ["node"]
CMD ["build/index.js"]
