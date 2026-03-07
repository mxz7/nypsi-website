import { redirect } from "@sveltejs/kit";

/**
 * proxies flag images from flagcdn to prevent cheating on guess the flag games
 *
 * they can literally still just screenshot it and google it though it's impossible to prevent that
 */

export async function GET({ params }) {
  const countryCode = Buffer.from(params.flag, "hex").toString();
  const url = `https://flagcdn.com/w320/${countryCode}.png`;

  const response = await fetch(url);

  if (response.status !== 200) {
    return redirect(303, url);
  }

  return new Response(await response.bytes(), {
    headers: { "content-type": "image/png", "cache-control": "max-age=31536000" },
  });
}
