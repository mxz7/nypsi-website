export const load = async ({ parent, fetch }) => {
  const data = await parent();

  if (!data.user.authenticated) return { premium: false };

  const res = await fetch("/api/user/ispremium/" + data.user.id).then((r) => r.json());

  if (!res.premium) return { premium: false };
  return { premium: true };
};
