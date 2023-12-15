import { VIEW_AUTH } from "$env/static/private";
import prisma from "$lib/server/database.js";
import { UserRequestData } from "$lib/types/api/UserView.js";
import { error, json } from "@sveltejs/kit";
import dayjs from "dayjs";

export async function POST({ request }) {
  if (request.headers.get("Authorization") !== VIEW_AUTH) throw error(401);

  const body = await request.json();

  const res = UserRequestData.safeParse(body);

  if (res.success === false) return json(res.error, { status: 400 });

  if (res.data.userId === res.data.viewerId) return json(null, { status: 200 });

  const views = await prisma.profileView.findMany({
    where: {
      AND: [
        { createdAt: { gt: dayjs().subtract(10, "minutes").toDate() } },
        { userId: res.data.userId },
      ],
    },
  });

  for (const view of views) {
    if (res.data.viewerId === view.viewerId) return json(null, { status: 200 });
    if (view.viewerIp === res.data.viewerIp) return json(null, { status: 200 });
    if (new Date(view.createdAt).getTime() >= dayjs().subtract(1, "minute").toDate().getTime())
      return;
  }

  await prisma.profileView.create({
    data: {
      source: "WEB",
      userId: res.data.userId,
      referrer: res.data.referrer,
      viewerId: res.data.viewerId,
      viewerIp: res.data.viewerIp,
    },
  });

  return json(null, { status: 200 });
}
