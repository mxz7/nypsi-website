import { API } from "$env/static/private";

export const GET = async ({ getClientAddress }) => {
  const res = await fetch(`${API}/commands-today`, {
    headers: {
      "X-Forwarded-For": getClientAddress()
    }
  });

  return new Response(JSON.stringify(await res.json()), { status: 200 });
};
