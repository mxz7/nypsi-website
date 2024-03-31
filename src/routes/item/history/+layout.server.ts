export const load = async ({ fetch, locals }) => {
  const auth = await locals.validate();

  if (!auth) return { premium: false };

  const res = await fetch("/api/user/ispremium/" + auth.user.id).then((r) => r.json());

  if (!res.premium) return { premium: false, user: auth.user };
  return { premium: true, user: auth.user };
};
