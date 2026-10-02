import { defineEnvVars } from "@sveltejs/kit/env";

// Preserve the previous empty-string fallbacks so builds do not require runtime
// service credentials. Deployment supplies service values; Loki is optional.
// An unset Redis URL intentionally uses the Redis client’s local default.
export const variables = defineEnvVars({
  BOT_SERVER_URL: { schema: (input) => input ?? "" },
  BOT_API_AUTH: { schema: (input) => input ?? "" },
  HCAPTCHA_SECRET: { schema: (input) => input ?? "" },
  PUBLIC_HCAPTCHA_SITEKEY: { public: true, schema: (input) => input ?? "" },
  TOPGG_TOKEN: { schema: (input) => input ?? "" },
  PUBLIC_URL: { public: true, schema: (input) => input ?? "" },
  DATABASE_URL: { schema: (input) => input ?? "" },
  LOKI_USERNAME: { schema: (input) => input ?? "" },
  LOKI_PASSWORD: { schema: (input) => input ?? "" },
  LOKI_HOST: { schema: (input) => input ?? "" },
  REDIS_URL: { schema: (input) => input ?? "" },
  DISCORD_OAUTH_CLIENTID: { schema: (input) => input ?? "" },
  DISCORD_OAUTH_SECRET: { schema: (input) => input ?? "" },
  DISCORD_OAUTH_REDIRECT: { schema: (input) => input ?? "" },
});
