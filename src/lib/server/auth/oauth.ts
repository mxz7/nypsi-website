import {
  DISCORD_OAUTH_CLIENTID,
  DISCORD_OAUTH_SECRET,
  DISCORD_OAUTH_REDIRECT,
} from "$app/env/private";

import { Discord } from "arctic";

export const discord = new Discord(
  DISCORD_OAUTH_CLIENTID,
  DISCORD_OAUTH_SECRET,
  DISCORD_OAUTH_REDIRECT,
);
