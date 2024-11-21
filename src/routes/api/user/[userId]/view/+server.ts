import { dev } from "$app/environment";
import prisma from "$lib/server/database.js";
import dayjs from "dayjs";

export async function POST({ params, request, locals, getClientAddress }) {
  if (dev) return new Response(null, { status: 200 });
  const userAgent = request.headers.get("user-agent");
  const userId = params.userId;

  if (userAgent && userAgent.includes("bot")) return new Response(null, { status: 200 });

  const auth = await locals.validate();

  if (auth && auth.user.id === userId) return new Response(null, { status: 200 });

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
        { OR: [{ viewerId: auth?.user.id }, { viewerIp: ip }] },
      ],
    },
  });

  if (views.length > 0) return new Response(null, { status: 200 });

  await prisma.profileView.create({
    data: {
      source: "WEB",
      userId,
      viewerId: auth?.user.id,
      viewerIp: ip,
    },
  });

  return new Response(null, { status: 200 });
}
