import { getEventData } from "$lib/functions/items.js";
import {
  getEvent,
  getEventProgress,
  getTotalUsers,
  getUserPosition,
} from "$lib/server/functions/event.js";
import { error, redirect } from "@sveltejs/kit";

export async function load({ locals, fetch, params }) {
  const id = parseInt(params.id);

  if (!id || isNaN(id) || id < 0) return error(404, "event not found");

  const event = await getEvent();
  const eventsData = getEventData(fetch);

  if (!event) {
    return error(404, "event not found");
  }

  if (!event.completed && new Date(event.expiresAt).getTime() > Date.now()) {
    return redirect(302, "/events");
  }

  let userPosition: Promise<number> | undefined;
  let totalUsers: Promise<number> | undefined;

  const auth = await locals.validate();

  if (auth?.user) {
    userPosition = getUserPosition(event.id, auth.user.id);
    totalUsers = getTotalUsers(event.id);
  }

  const totalContribution = event.completed
    ? Number(event.target)
    : getEventProgress(event.id, true);

  return {
    eventsData: await eventsData,
    event,
    totalContribution: await totalContribution,
    userPosition: userPosition ? await userPosition : undefined,
    totalUsers,
    auth,
  };
}
