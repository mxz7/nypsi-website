import { redirect } from "@sveltejs/kit";

export const prerender = true;

export async function GET() {
  return redirect(
    301,
    "https://discord.com/oauth2/authorize?client_id=678711738845102087&permissions=1377879583830&scope=bot%20applications.commands",
  );
}
