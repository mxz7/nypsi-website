import { env } from "$env/dynamic/private";
import { getAuthedUser } from "$lib/api/auth.remote";
import { fail, redirect } from "@sveltejs/kit";

export async function load({ locals, parent }) {
  const { user } = await parent();

  if (!user) return redirect(302, "/me");

  if (user.adminLevel < 1) return redirect(302, "/me");

  return { adminLevel: user.adminLevel };
}

export const actions = {
  reboot: async () => {
    const authedUser = await getAuthedUser();

    if (!authedUser) return fail(401);

    if (authedUser.adminLevel < 4) return fail(401);

    const res = await fetch(`${env.BOT_SERVER_URL}/reboot`, {
      method: "post",
      headers: {
        authorization: `Bearer ${env.BOT_API_AUTH}`,
      },
    }).catch(() => ({ status: 500 }));

    if (res.status === 200) return { success: true };
    return fail(500);
  },
  pauseStreaks: async () => {
    const authedUser = await getAuthedUser();

    if (!authedUser) return fail(401);

    if (authedUser.adminLevel < 4) return fail(401);

    const res = await fetch(`${env.BOT_SERVER_URL}/pausestreak`, {
      method: "post",
      headers: {
        authorization: `Bearer ${env.BOT_API_AUTH}`,
      },
    }).catch(() => ({ status: 500 }));

    if (res.status === 200) return { success: true };
    return fail(500);
  },
};
