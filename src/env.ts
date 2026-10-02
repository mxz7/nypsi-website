import { defineEnvVars } from "@sveltejs/kit/env";

// @migration-task Review usage of dynamic environment variables. They fall back to the empty string if not present, which may not be what you want.
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
