import { requireAuth } from "#lib/api/auth.remote.js";

export async function load({ locals, url }) {
  const authedUser = await requireAuth(url.pathname + url.search);

  return { user: authedUser };
}
