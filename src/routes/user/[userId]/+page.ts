import getItems from "$lib/functions/getItems.js";
import type { UserApiResponse } from "$lib/types/User.js";
import { redirect } from "@sveltejs/kit";
import dayjs from "dayjs";

export const ssr = false;

export const load = async ({ parent, params, fetch }) => {
  let userId = params.userId;

  let data: Promise<UserApiResponse>;

  if (userId === "me") {
    const { user } = await parent();
    if (!user.authenticated) throw redirect(303, "/login");

    userId = user.id;
  } else if (userId.match(/^\d{17,19}$/)) {
    data = fetch(`/api/user/${userId}`).then((r) => r.json());
  } else {
    if (!userId.match(/^[_.\w0-9]{2,32}$/)) throw redirect(303, "/user");

    data = (async () => {
      const fetchFromApi = async () => {
        const res = await fetch(`/api/usernametoid/${userId}`).then((r) => r.json());
        if (res.error !== 429) {
          res.expire = dayjs().add(3, "hours").toDate().getTime();
          localStorage.setItem(`id-user-map-${userId}`, JSON.stringify(res));
        }
        return res;
      };

      let usernameRes;

      if (localStorage.getItem(`id-user-map-${userId}`)) {
        usernameRes = JSON.parse(localStorage.getItem(`id-user-map-${userId}`) as string);
        if (usernameRes.expire && usernameRes.expire < Date.now()) {
          localStorage.removeItem(`id-user-map-${userId}`);
          usernameRes = await fetchFromApi();
        }
      } else {
        usernameRes = await fetchFromApi();
      }

      return usernameRes;
    })().then(async (r) => {
      if (r.error) return r;
      return fetch(`/api/user/${r.id}`).then((r) => r.json());
    });
  }

  return {
    base: 69,
    streamed: {
      // @ts-expect-error weird shit wtf
      userData: data,
      items: getItems(),
    },
  };
};
