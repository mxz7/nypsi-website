import { redirect } from "@sveltejs/kit";

export async function GET() {
  return redirect(303, "/leaderboard");
}
