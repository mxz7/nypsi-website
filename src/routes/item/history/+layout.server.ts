import type { User } from "lucia";

export const load = async ({ parent, fetch }) => {
  const { user } = await parent();

  if (!user) return { premium: false };

  const res = await fetch("/api/user/ispremium/" + user.id).then((r) => r.json());

  if (!res.premium) return { premium: false, user };
  return { premium: true, user: user as User };
};
