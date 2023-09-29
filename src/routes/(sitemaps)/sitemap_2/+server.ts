import getItems from "$lib/functions/getItems";
import prisma from "$lib/server/database";
import dayjs from "dayjs";

const website = "https://nypsi.xyz";

export async function GET() {
  const leaderboards = ["balance", "networth", "wordle", ...(await getItems()).map((i) => i.id)];
  const users = await prisma.economy
    .findMany({
      where: {
        AND: [
          { user: { Preferences: { leaderboards: true } } },
          { prestige: { gte: 1 } },
          {
            user: {
              lastCommand: { gt: dayjs().subtract(7, "days").toDate() },
            },
          },
        ],
      },
      select: { user: { select: { lastKnownUsername: true } } },
    })
    .then((i) => i.map((i) => i.user.lastKnownUsername));
  const guilds = await prisma.economyGuild
    .findMany({
      where: {
        level: { gt: 2 },
      },
      select: { guildName: true },
    })
    .then((i) => i.map((i) => i.guildName));

  const response = new Response(`<?xml version="1.0" encoding="UTF-8" ?>
  <urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  >
    <url>
      <loc>${website}</loc>
    </url>

    <url>
      <loc>${website}/status</loc>
    </url>

    <url>
      <loc>${website}/leaderboard</loc>
    </url>

    ${leaderboards
      .map(
        (i) => `<url>
        <loc>${website}/leaderboard/${i}</loc>
      </url>`,
      )
      .join("\n")}

    ${users
      .map(
        (i) => `<url>
        <loc>${website}/user/${i}</loc>
      </url>`,
      )
      .join("\n")}

    ${guilds
      .map(
        (i) => `<url>
        <loc>${website}/guild/${encodeURIComponent(i)}</loc>
      </url>`,
      )
      .join("\n")}
  </urlset>`);

  response.headers.set("cache-control", "s-maxage=3600");
  response.headers.set("content-type", "application/xml");

  return response;
}
