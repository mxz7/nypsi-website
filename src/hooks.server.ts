export const handle = async ({ event, resolve }) => {
  // if (!dev && !event.isSubRequest && event.url.pathname.startsWith("/api")) {
  //   const rateLimitAttempt = await rateLimiter.limit(event.getClientAddress()).catch(() => {
  //     return { success: true, reset: 69 };
  //   });

  //   if (!rateLimitAttempt.success) {
  //     const timeRemaining = Math.floor((rateLimitAttempt.reset - new Date().getTime()) / 1000);

  //     return error(429, `too many requests. please try again in ${timeRemaining} seconds.`);
  //   }
  // }

  event.locals.validate = async () => {
    if (event.cookies.getAll().length === 0) return null;
    if (event.request.headers.get("user-agent")?.toLowerCase().includes("bot")) return null;
    const res = await event.fetch("/api/auth").then((r) => r.json());
    const { user, session } = res;

    if (!user || !session) return null;

    return { user, session };
  };

  const res = await resolve(event);

  if (
    (res.redirected || res.status === 404 || res.status === 500) &&
    res.headers.get("cache-control")
  )
    res.headers.delete("cache-control");

  return res;
};
