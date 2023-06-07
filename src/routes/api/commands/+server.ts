import rateLimiter from "$lib/server/ratelimit.js";

export const GET = async ({ getClientAddress, setHeaders }) => {
  const rateLimitAttempt = await rateLimiter.limit(getClientAddress());

  if (!rateLimitAttempt.success) {
    const timeRemaining = Math.floor((rateLimitAttempt.reset - new Date().getTime()) / 1000);
    return new Response(
      JSON.stringify({ error: `Too many requests. Please try again in ${timeRemaining} seconds.` }),
      {
        status: 429
      }
    );
  }

  setHeaders({
    "cache-control": "max-age=300"
  });

  const res = await fetch(`${process.env.API || "http://localhost:6969"}/commands-today`, {
    headers: {
      "X-Forwarded-For": getClientAddress()
    }
  }).catch(() => null);

  if (!res) return new Response("https://http.cat/500", { status: 500 });

  return new Response(JSON.stringify(await res.json()), { status: 200 });
};
