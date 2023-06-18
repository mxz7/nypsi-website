import { redirect } from "@sveltejs/kit";
import dayjs from "dayjs";

export const ssr = false;

export const load = async ({ url, fetch }) => {
  const search = url.searchParams.get("search");

  if (!search) {
    return;
  }

  let res: { error?: number; status?: number; message?: string; id?: number; expire?: number };

  const fetchFromApi = async () => {
    const res = await fetch(`/api/usernametoid/${search}`).then((r) => r.json());
    if (res.error !== 429) {
      res.expire = dayjs().add(3, "hours").toDate().getTime();
      localStorage.setItem(`id-user-map-${search}`, JSON.stringify(res));
    }
    return res;
  };

  if (localStorage.getItem(`id-user-map-${search}`)) {
    res = JSON.parse(localStorage.getItem(`id-user-map-${search}`) as string);
    if (res.expire && res.expire < Date.now()) {
      localStorage.removeItem(`id-user-map-${search}`);
      res = await fetchFromApi();
    }
  } else {
    res = await fetchFromApi();
  }

  if (res.error === 429) return res;

  if (res.id) {
    throw redirect(302, `/user/${res.id}`);
  } else {
    throw redirect(302, "/user/unknown");
  }
};
