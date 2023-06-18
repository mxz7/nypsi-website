import getItems from "$lib/functions/getItems.js";
import type { UserApiResponse } from "$lib/types/User.js";
import { redirect } from "@sveltejs/kit";

export const load = async ({ parent, params, fetch }) => {
  let userId = params.userId;
  if (userId === "me") {
    const { user } = await parent();
    if (!user.authenticated) throw redirect(303, "/login");

    userId = user.id;
  }

  return {
    base: 69,
    streamed: {
      userData: fetch(`/api/user/${userId}`).then((r) => r.json()) as Promise<UserApiResponse>,
      items: getItems(),
    },
  };
};
