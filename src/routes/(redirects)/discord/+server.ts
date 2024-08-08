import { redirect } from "@sveltejs/kit";



export async function GET({ setHeaders }) {
  setHeaders({ "cache-control": "max-age=31556952" });
  return redirect(301, "https://discord.com/invite/hJTDNST");
}
