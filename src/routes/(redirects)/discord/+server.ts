import { redirect } from "@sveltejs/kit";

export async function GET({ setHeaders }) {
  setHeaders({ "cache-control": "public, max-age=600, must-revalidate" });
  return redirect(301, "https://discord.com/invite/hJTDNST");
}
