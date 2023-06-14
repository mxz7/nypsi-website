import { redirect } from "@sveltejs/kit";

export const GET = ({ cookies }) => {
  cookies.delete("discord_access_token");
  cookies.delete("discord_refresh_token");

  throw redirect(302, "/");
};
