import { pathsRaw } from "$lib/data/docs";

export const prerender = true;

const site = "https://nypsi.xyz"; // change this to reflect your domain
const pages: string[] = ["leaderboard", "status"]; // populate this with all the slugs you wish to include

pages.push(
  ...pathsRaw
    .map((i) => i.replace("/+page.md", ""))
    .map((i) => i.replace("/+page.svelte", ""))
    .map((i) => `docs/${i}`),
);

export async function GET() {
  const body = sitemap(pages);
  const response = new Response(body);
  response.headers.set("Cache-Control", "max-age=0, s-maxage=3600");
  response.headers.set("Content-Type", "application/xml");
  return response;
}

const sitemap = (pages: string[]) => `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="https://www.w3.org/1999/xhtml"
  xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
<url>
    <loc>${site}</loc>
    <priority>1</priority>
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
</urlset>`;
