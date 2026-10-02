import { building } from "$app/env";
import { defineEnvVars } from "@sveltejs/kit/env";
import z from "zod";

// Builds do not need service credentials, but runtime startup must fail if they are missing.
const required = building ? z.string().default("") : z.string().min(1);

export const variables = defineEnvVars({
  BOT_SERVER_URL: { schema: required },
  BOT_API_AUTH: { schema: required },
  HCAPTCHA_SECRET: { schema: required },
  PUBLIC_HCAPTCHA_SITEKEY: { public: true, schema: required },
  TOPGG_TOKEN: { schema: required },
  PUBLIC_URL: { public: true, schema: required },
  DATABASE_URL: { schema: required },
  LOKI_USERNAME: { schema: (input) => input ?? "" },
  LOKI_PASSWORD: { schema: (input) => input ?? "" },
  LOKI_HOST: { schema: (input) => input ?? "" },
  // An empty URL uses ioredis’s localhost default.
  REDIS_URL: { schema: (input) => input ?? "" },
  DISCORD_OAUTH_CLIENTID: { schema: required },
  DISCORD_OAUTH_SECRET: { schema: required },
  DISCORD_OAUTH_REDIRECT: { schema: required },
});
