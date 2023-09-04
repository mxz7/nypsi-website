import prisma from "$lib/server/database";

const pages: string[] = ["guild"];

const site = "https://nypsi.xyz";

export async function GET() {
  const guilds = await prisma.economyGuild.findMany({
    where: {
      level: { gt: 2 },
    },
    select: { guildName: true },
  });

  pages.push(...guilds.map((i) => `guild/${encodeURIComponent(i.guildName)}`));

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
