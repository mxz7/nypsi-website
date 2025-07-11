import { getEventData } from "$lib/functions/items.js";
import { getCurrentEvent, getPastEvents, getUserPosition } from "$lib/server/functions/event.js";

export async function load({ locals, fetch, depends }) {
  depends("event");
  const auth = await locals.validate();

  const [event, eventsData] = await Promise.all([getCurrentEvent(), getEventData(fetch)]);

  if (!event) {
    return {
      eventsData,
      pastEvents: getPastEvents(),
    };
  }

  let userPosition: Promise<number> | undefined;

  if (auth?.user) {
    userPosition = getUserPosition(event.id, auth.user.id);
  }

  return {
    eventsData,
    event,
    userPosition: userPosition ? await userPosition : undefined,
    pastEvents: getPastEvents(),
  };
}
