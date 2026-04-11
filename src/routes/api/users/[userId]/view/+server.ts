import { dev } from "$app/environment";
import { getAuthedUser } from "$lib/api/auth.remote";
import prisma from "$lib/server/database.js";
import dayjs from "dayjs";

export async function POST({ params, request, getClientAddress }) {
  if (dev) return new Response(null, { status: 200 });
  const userAgent = request.headers.get("user-agent");
  const userId = params.userId;

  if (userAgent && userAgent.includes("bot")) return new Response(null, { status: 200 });

  const authedUser = await getAuthedUser();

  if (authedUser && authedUser.id === userId) return new Response(null, { status: 200 });

  let ip: string;

  try {
    ip = getClientAddress();
  } catch {
    ip = "127.0.0.1";
  }

  const views = await prisma.profileView.findMany({
    where: {
      AND: [
        { createdAt: { gt: dayjs().subtract(1, "hour").toDate() } },
        { userId: userId },
        { OR: [{ viewerId: authedUser?.id }, { viewerIp: ip }] },
      ],
    },
  });

  if (views.length > 0) return new Response(null, { status: 200 });

  await prisma.profileView.create({
    data: {
      source: "WEB",
      userId,
      viewerId: authedUser?.id,
      viewerIp: ip,
    },
  });

  return new Response(null, { status: 200 });
}
