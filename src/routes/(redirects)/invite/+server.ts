import { redirect } from "@sveltejs/kit";

export async function GET({ setHeaders }) {
  setHeaders({ "cache-control": "max-age=31556952" });
  return redirect(
    301,
    "https://discord.com/oauth2/authorize?client_id=678711738845102087&permissions=1377879583830&scope=bot%20applications.commands",
  );
}
