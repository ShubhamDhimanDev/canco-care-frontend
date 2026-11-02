import type { MetadataRoute } from "next";

import { getAllEventEntries } from "@/lib/api/events";
import { getAllStoryEntries, getTags } from "@/lib/api/stories";
import { SITE_URL } from "@/lib/site";

const PAGES = [
  "/",
  "/who-we-are",
  "/our-impact",
  "/upcoming-events",
  "/stories",
  "/partner-with-us",
  "/contact-us",
  "/terms-and-conditions",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stories, tags, events] = await Promise.all([
    getAllStoryEntries(),
    getTags(),
    getAllEventEntries(),
  ]);

  return [
    ...PAGES.map((path) => ({ url: `${SITE_URL}${path}` })),
    // Stories an editor hid from search engines stay out of the sitemap.
    ...stories
      .filter(({ noindex }) => !noindex)
      .map(({ slug, published_at }) => ({
        url: `${SITE_URL}/stories/${slug}`,
        lastModified: published_at ?? undefined,
      })),
    ...tags.map(({ slug }) => ({ url: `${SITE_URL}/stories/tag/${slug}` })),
    ...events.map(({ slug }) => ({
      url: `${SITE_URL}/upcoming-events/${slug}`,
    })),
  ];
}
