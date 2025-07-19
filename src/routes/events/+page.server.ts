import { getEventData } from "$lib/functions/items.js";
import {
  getEvent,
  getEventProgress,
  getPastEvents,
  getTotalUsers,
  getUserPosition,
} from "$lib/server/functions/event.js";

export async function load({ locals, fetch, depends }) {
  depends("event");
  const event = await getEvent();
  const eventsData = getEventData(fetch);

  if (!event) {
    return {
      eventsData: await eventsData,
      pastEvents: getPastEvents(),
    };
  }

  let userPosition: Promise<number> | undefined;
  let totalUsers: Promise<number> | undefined;

  const auth = await locals.validate();

  if (auth?.user) {
    userPosition = getUserPosition(event.id, auth.user.id);
    totalUsers = getTotalUsers(event.id);
  }

  const totalContribution = getEventProgress(event.id, false).then((value) =>
    Math.min(value, Number(event.target)),
  );

  return {
    eventsData: await eventsData,
    event,
    totalContribution: await totalContribution,
    userPosition: userPosition ? await userPosition : undefined,
    totalUsers,
    pastEvents: getPastEvents(),
    auth,
  };
}
