import { redirect } from "@sveltejs/kit";

export const load = async ({ parent, url, fetch }) => {
  const data = await parent();

  if (!data.user.authenticated)
    redirect(302, "/login?next=" + encodeURIComponent(url.pathname));

  const res = await fetch("/api/user/ispremium/" + data.user.id).then((r) => r.json());

  if (!res.premium) return { premium: false };
  return { premium: true };
};
