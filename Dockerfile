# syntax = docker/dockerfile:1

FROM node:22-slim as base

# SvelteKit/Prisma app lives here
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt update -qq && \
    apt install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3

# Copy needed things over
COPY --link .npmrc package.json pnpm-lock.yaml ./
COPY --link prisma ./prisma
COPY --link . .

RUN pnpm install --frozen-lockfile --prod=false

# Builds sveltekit tsconfig which prisma needs
RUN npx svelte-kit sync

RUN pwd
RUN ls
RUN ls src
RUN ls prisma

RUN npx prisma generate

# Debug
RUN pwd
RUN ls
RUN ls src
RUN ls prisma

# Build llms.txt
RUN npx tsx src/lib/build/llms.ts

RUN pnpm run build
RUN pnpm prune --prod

# Final stage for app image
FROM base

# # # Install packages needed for deployment
RUN apt update -qq && \
    apt install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built application
COPY --from=build /app/build /app/build
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app

# Set production environment
ENV NODE_ENV="production"
ENV ADDRESS_HEADER="cf-connecting-ip"

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "node", "./build/index.js" ]
