import prisma from "$lib/server/database";
import dayjs from "dayjs";

const pages = ["user"];

const site = "https://nypsi.xyz";

export async function GET() {
  const users = await prisma.economy.findMany({
    where: {
      AND: [
        { user: { Preferences: { leaderboards: true } } },
        { prestige: { gte: 7 } },
        {
          user: {
            lastCommand: { gt: dayjs().subtract(7, "days").toDate() },
          },
        },
      ],
    },
    select: { user: { select: { lastKnownUsername: true } } },
  });

  pages.push(
    ...users
      .map((i) =>
        i.user.lastKnownUsername.replaceAll(/[^a-zA-Z\d_.:]/gm, "").length > 0
          ? `user/${encodeURIComponent(
              i.user.lastKnownUsername.replaceAll(/[^a-zA-Z\d_.:]/gm, ""),
            )}`
          : null,
      )
      .filter((i) => Boolean(i)),
  );

  const body = sitemap(pages);
  const response = new Response(body);
  response.headers.set("Cache-Control", "max-age=0, s-maxage=3600");
  response.headers.set("Content-Type", "application/xml");
  return response;
}

const sitemap = (pages: string[]) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${site}/${page}</loc>
  </url>
  `,
    )
    .join("")}
</urlset>`;
