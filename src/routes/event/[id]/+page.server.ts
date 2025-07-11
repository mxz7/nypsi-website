import { getEventData } from "$lib/functions/items.js";
import { getCurrentEvent, getUserPosition } from "$lib/server/functions/event.js";
import { error, redirect } from "@sveltejs/kit";

export async function load({ locals, fetch, params }) {
  const id = parseInt(params.id);

  if (!id || isNaN(id) || id < 0) return error(404, "event not found");

  const auth = await locals.validate();

  const [event, eventsData] = await Promise.all([getCurrentEvent(id), getEventData(fetch)]);

  if (!event) {
    return error(404, "event not found");
  }

  if (!event.completed && event.expiresAt.getTime() < Date.now()) {
    return redirect(302, "/event");
  }

  let userPosition: Promise<number> | undefined;

  if (auth?.user) {
    userPosition = getUserPosition(event.id, auth.user.id);
  }

  return {
    eventsData,
    event,
    userPosition: userPosition ? await userPosition : undefined,
  };
}
