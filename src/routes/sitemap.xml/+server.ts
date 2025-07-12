import { pathsRaw } from "$lib/data/docs";
import getItems from "$lib/functions/items";

const site = "https://nypsi.xyz"; // change this to reflect your domain

export async function GET({ fetch }) {
  const items = await getItems(fetch);

  const pages: string[] = ["leaderboards", "status", "events"]; // populate this with all the slugs you wish to include

  pages.push(
    ...pathsRaw
      .map((i) => `docs/${i}`)
      .map((i) => i.replaceAll("/+page.md", ""))
      .map((i) => i.replaceAll("/+page.svelte", "")),
  );

  pages.push(...items.map((i) => `item/${i.id}`));

  const body = sitemap(pages);
  const response = new Response(body);
  response.headers.set("Content-Type", "application/xml");
  response.headers.set("Cache-Control", "max-age=86400");
  return response;
}

const sitemap = (pages: string[]) =>
  `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
	xmlns:xhtml="http://www.w3.org/1999/xhtml"
	xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
	xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
	xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
	xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
>
<url>
    <loc>${site}</loc>
  </url>
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${site}/${page}</loc>
  </url>
  `,
    )
    .join("")}
</urlset>`.trim();
