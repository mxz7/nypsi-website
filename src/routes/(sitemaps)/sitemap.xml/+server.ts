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
    xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
  >
    <url>
      <loc>${website}</loc>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>

    <url>
      <loc>${website}/status</loc>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>

    <url>
      <loc>${website}/leaderboard</loc>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>

    ${leaderboards
      .map(
        (i) => `<url>
        <loc>${website}/leaderboard/${i}</loc>
        <changefreq>daily</changefreq>
        <priority>0.7</priority>
      </url>`,
      )
      .join("\n")}

    ${users
      .map(
        (i) => `<url>
        <loc>${website}/user/${i}</loc>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
      </url>`,
      )
      .join("\n")}

    ${guilds
      .map(
        (i) => `<url>
        <loc>${website}/guild/${encodeURIComponent(i)}</loc>
        <changefreq>daily</changefreq>
        <priority>0.6</priority>
      </url>`,
      )
      .join("\n")}
  </urlset>`);

  response.headers.set("cache-control", "s-maxage=3600");
  response.headers.set("content-type", "application/xml");

  return response;
}
