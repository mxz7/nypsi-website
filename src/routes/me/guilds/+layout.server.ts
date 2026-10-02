import { getGuilds } from "#lib/server/functions/discordapi/guilds.js";
import { requireAuth } from "#lib/api/auth.remote.js";
import { discordReconnectRequired } from "#lib/server/auth/discord-tokens.js";

export async function load({ locals, url }) {
  const authedUser = await requireAuth(url.pathname + url.search);

  const guilds = await getGuilds(authedUser, locals);

  if (!guilds) discordReconnectRequired(url);

  return { user: authedUser, guilds };
}
