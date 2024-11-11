import { redirect } from "@sveltejs/kit";

export const load = async ({ url }) => {
  const search = url.searchParams.get("search");

  if (!search) {
    return;
  }

  redirect(302, "/user/" + search);
};
