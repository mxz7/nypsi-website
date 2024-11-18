# syntax = docker/dockerfile:1

FROM node:20-alpine as base

LABEL fly_launch_runtime="SvelteKit/Prisma"

# SvelteKit/Prisma app lives here
WORKDIR /app

# set dummy env variables for build
# ENV DATABASE_URL
# ENV REDIS_URL
# ENV REDIS_PASS
# ENV TOPGG_TOKEN
# ENV DISCORD_OAUTH_CLIENTID
# ENV DISCORD_OAUTH_SECRET
# ENV PUBLIC_OAUTH_URL
# ENV DISCORD_OAUTH_REDIRECT
# ENV BOT_SERVER_URL
# ENV PUBLIC_URL
# ENV VIEW_AUTH
# ENV PUBLIC_HCAPTCHA_SITEKEY
# ENV HCAPTCHA_SECRET

# Install pnpm
RUN npm install -g pnpm

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
# RUN apt update -qq && \
#     apt install --no-install-recommends -y build-essential node-gyp openssl pkg-config python-is-python3

# Install node modules
COPY --link .npmrc package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

# Generate Prisma Client
COPY --link prisma .
RUN npx prisma generate

# Copy application code
COPY --link . .

# Build application
RUN pnpm run build

# Remove development dependencies
RUN pnpm prune --prod


# Final stage for app image
FROM base

# # # Install packages needed for deployment
# RUN apt update -qq && \
#     apt install --no-install-recommends -y openssl && \
#     rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built application
COPY --from=build /app/build /app/build
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app

# Set production environment
ENV NODE_ENV="production"

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "node", "./build/index.js" ]
