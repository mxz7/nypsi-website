import { getEventData } from "$lib/functions/items.js";
import {
  getEvent,
  getPastEvents,
  getTotalUsers,
  getUserPosition,
} from "$lib/server/functions/event.js";

export async function load({ locals, fetch, depends }) {
  depends("event");
  const auth = await locals.validate();

  const [event, eventsData] = await Promise.all([getEvent(), getEventData(fetch)]);

  if (!event) {
    return {
      eventsData,
      pastEvents: getPastEvents(),
    };
  }

  let userPosition: Promise<number> | undefined;
  let totalUsers: Promise<number> | undefined;

  if (auth?.user) {
    userPosition = getUserPosition(event.id, auth.user.id);
    totalUsers = getTotalUsers(event.id);
  }

  return {
    eventsData,
    event,
    userPosition: userPosition ? await userPosition : undefined,
    totalUsers,
    pastEvents: getPastEvents(),
  };
}
