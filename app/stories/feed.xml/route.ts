import { getStories } from "@/lib/api/stories";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

/** Escapes text for XML (the feed is built by hand, so anything an editor typed must be made safe). */
function xml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** RSS 2.0 feed of the 20 newest public stories. */
export async function GET() {
  const { data } = await getStories(1, 20);

  const items = data
    .filter((story) => !story.noindex)
    .map((story) => {
      const link = `${SITE_URL}/stories/${story.slug}`;

      return [
        "<item>",
        `<title>${xml(story.title)}</title>`,
        `<link>${xml(link)}</link>`,
        `<guid isPermaLink="true">${xml(link)}</guid>`,
        story.published_at
          ? `<pubDate>${new Date(story.published_at).toUTCString()}</pubDate>`
          : "",
        `<description>${xml(story.excerpt)}</description>`,
        ...story.tags.map((tag) => `<category>${xml(tag.name)}</category>`),
        "</item>",
      ].join("");
    })
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${xml(`${SITE_NAME} stories`)}</title><link>${xml(`${SITE_URL}/stories`)}</link><description>${xml(SITE_DESCRIPTION)}</description><language>en-ca</language><atom:link href="${xml(`${SITE_URL}/stories/feed.xml`)}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=900, stale-while-revalidate=3600",
    },
  });
}
