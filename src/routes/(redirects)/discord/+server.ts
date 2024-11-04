import { redirect } from "@sveltejs/kit";

export const prerender = true;

export async function GET() {
  return redirect(308, "https://discord.com/invite/hJTDNST");
}
