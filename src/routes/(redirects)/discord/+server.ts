import { redirect } from "@sveltejs/kit";

export const prerender = true;

export async function GET() {
  return redirect(301, "https://discord.com/invite/hJTDNST");
}
