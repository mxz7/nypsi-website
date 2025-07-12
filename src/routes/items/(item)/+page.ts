import { redirect } from "@sveltejs/kit";

export async function load({ parent }) {
  const { items } = await parent();

  const random = items[Math.floor(Math.random() * items.length)];

  return redirect(302, `/items/${random.id}`);
}
