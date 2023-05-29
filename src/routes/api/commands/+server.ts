export const GET = async ({ getClientAddress }) => {
  const res = await fetch(`${process.env.API || "http://localhost:6969"}/commands-today`, {
    headers: {
      "X-Forwarded-For": getClientAddress()
    }
  });

  return new Response(JSON.stringify(await res.json()), { status: 200 });
};
