import { redirect } from "@sveltejs/kit";

export function GET({ params }) {
  return redirect(301, `/wordles/${params.id}`);
}
