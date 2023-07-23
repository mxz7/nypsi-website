import getItems from '$lib/functions/getItems';
import prisma from '$lib/server/database';

const pages = ['leaderboard', 'user']; //list of pages as a string ex. ["about", "blog", "contact"]

const site = 'https://nypsi.xyz';

export async function GET() {
  const items = await getItems();
  const users = await prisma.economy.findMany({
    where: { user: { Preferences: { leaderboards: true } }, prestige: { gte: 5 } },
    select: { user: { select: { lastKnownUsername: true } } },
  });

  pages.push(...items.map((i) => `leaderboard/${i.id}`));
  pages.push(
    ...users.map((i) => `user/${i.user.lastKnownUsername.replaceAll(/[^a-zA-Z\d_.:]/gm, '')}`)
  );

  const body = sitemap(pages);
  const response = new Response(body);
  response.headers.set('Cache-Control', 'max-age=0, s-maxage=3600');
  response.headers.set('Content-Type', 'application/xml');
  return response;
}

const sitemap = (pages: string[]) => `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
>
  <url>
    <loc>${site}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${site}/${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
  `
    )
    .join('')}
</urlset>`;
