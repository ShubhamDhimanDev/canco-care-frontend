import type { MetadataRoute } from "next";

import { getAllStoryEntries } from "@/lib/api/stories";
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
  const stories = await getAllStoryEntries();

  return [
    ...PAGES.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...stories.map(({ slug, published_at }) => ({
      url: `${SITE_URL}/stories/${slug}`,
      lastModified: published_at ?? undefined,
    })),
  ];
}
