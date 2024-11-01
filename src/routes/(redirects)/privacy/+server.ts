import { redirect } from "@sveltejs/kit";

export const prerender = true;

export function load() {
  return redirect(301, "/docs/privacy");
}
