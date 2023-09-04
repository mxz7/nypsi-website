const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://nypsi.xyz/sitemap/users</loc>
  </sitemap>
  <sitemap>
    <loc>https://nypsi.xyz/sitemap/guilds</loc>
  </sitemap>
  <sitemap>
    <loc>https://nypsi.xyz/sitemap/leaderboards</loc>
  </sitemap>
</sitemapindex>`;

export async function GET() {
  const response = new Response(xml);
  response.headers.set("Cache-Control", "max-age=0, s-maxage=3600");
  response.headers.set("Content-Type", "application/xml");
  return response;
}
