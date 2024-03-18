import type { User } from "lucia";

export const load = async ({ parent, fetch }) => {
  let { user } = await parent();

  user = await user;

  if (!user) return { premium: false };

  const res = await fetch("/api/user/ispremium/" + user.id).then((r) => r.json());

  if (!res.premium) return { premium: false, user };
  return { premium: true, user: user as User };
};
