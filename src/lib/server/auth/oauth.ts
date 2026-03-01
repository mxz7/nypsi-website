import { env } from "$env/dynamic/private";
import { Discord } from "arctic";

export const discord = new Discord(
  env.DISCORD_OAUTH_CLIENTID,
  env.DISCORD_OAUTH_SECRET,
  env.DISCORD_OAUTH_REDIRECT,
);

