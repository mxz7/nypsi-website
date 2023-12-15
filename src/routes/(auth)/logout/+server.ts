import { redirect } from "@sveltejs/kit";

export const config = {
  runtime: "edge",
  regions: "all",
};

export const GET = ({ cookies, url }) => {
  cookies.delete("discord_access_token", { path: "/" });
  cookies.delete("discord_refresh_token", { path: "/" });

  const redirectTo = url.searchParams.get("next");

  return redirect(302, redirectTo || "/");
};
