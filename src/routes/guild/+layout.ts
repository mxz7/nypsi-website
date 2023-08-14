import { redirect } from "@sveltejs/kit";

export const load = async ({ url }) => {
  const search = url.searchParams.get("search");

  if (!search) {
    return;
  }

  throw redirect(302, `/guild/${search}`);
};
