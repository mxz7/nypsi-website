import { dev } from "$app/environment";
import rateLimiter from "$lib/server/ratelimit";
import type { User, UserSession } from "$lib/types/User";

import { error, redirect } from "@sveltejs/kit";

export const handle = async ({ event, resolve }) => {
  if (!dev && event.url.pathname.startsWith("/api")) {
    const rateLimitAttempt = await rateLimiter.limit(event.getClientAddress());

    if (!rateLimitAttempt.success) {
      const timeRemaining = Math.floor((rateLimitAttempt.reset - new Date().getTime()) / 1000);
      return new Response(
        JSON.stringify({
          message: `Too many requests. Please try again in ${timeRemaining} seconds.`,
          error: 429,
          status: 429,
        }),
        {
          status: 429,
        }
      );
    }
  } else if (!event.url.pathname.startsWith("/api")) {
    event.locals.getUser = async (cookies, fetch) => {
      const user: UserSession = { authenticated: false };

      if (cookies.get("discord_refresh_token") && !cookies.get("discord_access_token")) {
        const res = await fetch(`/login?refresh=${cookies.get("discord_refresh_token")}`)
          .then((r) => r.json())
          .catch(() => {
            /* boobs */
          });

        if (!res || res.error) {
          throw redirect(307, "/logout");
        }

        const userRequest = await fetch("https://discord.com/api/users/@me", {
          headers: { Authorization: `Bearer ${res.access_token}` },
        }).then((r) => r.json());

        if (userRequest.error) {
          cookies.delete("discord_access_token");
          cookies.delete("discord_refresh_token");
          console.error(userRequest.error);
          throw error(400, { message: "something went wrong", ...userRequest });
        }

        (user as unknown as User).authenticated = true;
        (user as unknown as User).avatar = userRequest.avatar;
        (user as unknown as User).discriminator = userRequest.discriminator;
        (user as unknown as User).username = userRequest.username;
        (user as unknown as User).id = userRequest.id;
      } else if (cookies.get("discord_access_token")) {
        const userRequest = await fetch("https://discord.com/api/users/@me", {
          headers: { Authorization: `Bearer ${cookies.get("discord_access_token")}` },
        }).then((r) => r.json());

        if (userRequest.error) {
          cookies.delete("discord_access_token");
          cookies.delete("discord_refresh_token");
          console.error(userRequest.error);
          throw error(400, { message: "something went wrong", ...userRequest });
        }

        (user as unknown as User).authenticated = true;
        (user as unknown as User).avatar = userRequest.avatar;
        (user as unknown as User).discriminator = userRequest.discriminator;
        (user as unknown as User).username = userRequest.username;
        (user as unknown as User).id = userRequest.id;
      }

      return user;
    };
  }

  const response = await resolve(event);
  return response;
};
