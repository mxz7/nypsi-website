import { redirect } from "@sveltejs/kit";

export const ssr = false;

export const load = async ({ url }) => {
  const search = url.searchParams.get("search");

  if (!search) {
    return;
  }

  throw redirect(300, "/user/" + search);
};
