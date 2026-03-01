import { redirect } from "@sveltejs/kit";

export function GET({ params }) {
  return redirect(308, `/wiki/${params.page}`);
}
