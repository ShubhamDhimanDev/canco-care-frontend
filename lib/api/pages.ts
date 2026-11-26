import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { LIVE } from "@/lib/api/cache";
import { apiGet, ApiError } from "@/lib/api/client";
import type { ApiImage, PageContent } from "@/lib/api/types";

export type PageSlug =
  | "who-we-are"
  | "our-impact"
  | "partner-with-us"
  | "contact-us"
  | "terms-and-conditions"
  | "privacy-policy";

/**
 * The words and pictures of a page edited in the admin ("Pages"). Laravel merges the editor's changes
 * over the original text, so every field is always present. Cached with the "settings" tag (the admin
 * refreshes it on save, and the impact figure used in `{amount}` follows donations).
 */
export async function getPage(slug: PageSlug): Promise<PageContent> {
  "use cache";
  cacheLife(LIVE);
  cacheTag("settings");

  const { status, body } = await apiGet<{ data?: { content?: PageContent } }>(
    `/pages/${slug}`,
  );
  const content = body?.data?.content;

  if (!content) {
    // A 404 here means the Laravel app behind API_URL predates the Pages module (not deployed yet, or
    // an old `php artisan route:cache`). Fail the build/render loudly instead of with a TypeError.
    throw new ApiError(
      status === 404
        ? `The API has no /pages/${slug} (HTTP 404). Deploy the latest admin and run "php artisan optimize:clear" (or "route:clear") on the API server, then rebuild.`
        : `The page "${slug}" came back empty (HTTP ${status}).`,
      status === 404 ? 404 : 502,
      `/pages/${slug}`,
    );
  }

  return content;
}

/** A text field of a page. */
export function pageText(content: PageContent, key: string): string {
  const value = content[key];

  return typeof value === "string" ? value : "";
}

/** An image field of a page: the chosen picture, or null when the bundled one should be used. */
export function pageImage(content: PageContent, key: string): ApiImage | null {
  const value = content[key];

  return value !== null && typeof value === "object" ? value : null;
}
