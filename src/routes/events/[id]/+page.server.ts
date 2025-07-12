import { getEventData } from "$lib/functions/items.js";
import { getEvent, getTotalUsers, getUserPosition } from "$lib/server/functions/event.js";
import { error, redirect } from "@sveltejs/kit";

export async function load({ locals, fetch, params }) {
  const id = parseInt(params.id);

  if (!id || isNaN(id) || id < 0) return error(404, "event not found");

  const auth = await locals.validate();

  const [event, eventsData] = await Promise.all([getEvent(id, true), getEventData(fetch)]);

  if (!event) {
    return error(404, "event not found");
  }

  if (!event.completed && event.expiresAt.getTime() < Date.now()) {
    return redirect(302, "/events");
  }

  const totalContribution = event.contributions
    .map((user) => user.contribution)
    .reduce((a, b) => Number(a) + Number(b), 0);

  event.contributions = event.contributions.slice(0, 50);

  let userPosition: Promise<number> | undefined;
  let totalUsers: Promise<number> | undefined;

  if (auth?.user) {
    userPosition = getUserPosition(event.id, auth.user.id);
    totalUsers = getTotalUsers(event.id);
  }

  return {
    eventsData,
    event,
    totalContribution,
    userPosition: userPosition ? await userPosition : undefined,
    totalUsers,
    auth,
  };
}
