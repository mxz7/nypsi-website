# syntax = docker/dockerfile:1

FROM node:24-slim as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# SvelteKit/Prisma app lives here
WORKDIR /app

# install pnpm
RUN corepack enable pnpm && corepack install -g pnpm@latest

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt update -qq && \
    apt install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3

# dependencies
COPY --link .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch
RUN pnpm install -r --offline

COPY --link prisma ./prisma
COPY --link . .

# Builds sveltekit tsconfig which prisma needs
RUN npx svelte-kit sync

RUN npx prisma generate

# Build llms.txt
RUN npx tsx src/lib/build/llms.ts

RUN pnpm run build
RUN pnpm prune --prod

# Final stage for app image
FROM base

# # # Install packages needed for deployment
RUN apt update -qq && \
    apt install --no-install-recommends -y openssl curl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built application
COPY --from=build /app/build /app/build
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json

# Set production environment
ENV NODE_ENV="production"
ENV ADDRESS_HEADER="cf-connecting-ip"

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000

ENTRYPOINT ["node"]
CMD [ "build/index.js" ]
