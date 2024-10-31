import { redirect } from "@sveltejs/kit";

export const ssr = false;

export async function load({ setHeaders, parent, url, fetch }) {
  try {
    setHeaders({
      "cache-control": "private, max-age=0",
    });
  } catch {}

  const parentData = await parent();

  if (!parentData.user) return redirect(303, "/me");

  const isPremium = await fetch(`/api/user/ispremium/${parentData.user.id}`).then((r) => r.json());

  if (!isPremium.premium) return { premium: false };
  return { premium: true };
}
