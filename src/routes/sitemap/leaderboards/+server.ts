import getItems from "$lib/functions/getItems";

const pages: string[] = ["leaderboard", "leaderboard/balance", "leaderboard/networth"];

const site = "https://nypsi.xyz";

export async function GET() {
  const items = await getItems();

  pages.push(...items.map((i) => `leaderboard/${i.id}`));

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
