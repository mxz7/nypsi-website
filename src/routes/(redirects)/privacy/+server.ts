import { redirect } from "@sveltejs/kit";

export const prerender = true;

export function GET() {
  return redirect(308, "/docs/privacy");
}
