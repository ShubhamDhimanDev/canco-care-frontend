import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { LIVE } from "@/lib/api/cache";
import { apiGet, ApiError } from "@/lib/api/client";
import type {
  Paginated,
  Story,
  StoryCard,
  StoryLookup,
  Tag,
} from "@/lib/api/types";

// Every function here is cached with tags (ADR-003). Laravel tells /api/revalidate which tags
// changed when a story is saved; `cacheLife(LIVE)` is the safety net if that call never arrives.
// A thrown error is never cached, so an API outage cannot get baked into a page.

export const STORIES_PAGE_SIZE = 9;

export async function getStories(
  page = 1,
  perPage = STORIES_PAGE_SIZE,
  tag?: string,
): Promise<Paginated<StoryCard>> {
  "use cache";
  cacheLife(LIVE);
  cacheTag("stories");

  const query = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });

  if (tag) {
    query.set("tag", tag);
  }

  const { body } = await apiGet<Paginated<StoryCard>>(`/stories?${query}`);

  if (!body) {
    throw new ApiError("The stories list came back empty.", 502, "/stories");
  }

  return body;
}

/**
 * A visitor's search. Deliberately NOT cached: the words are free text, and caching every one would let
 * anyone fill the cache. Laravel does the matching (title, excerpt, summary).
 */
export async function searchStories(
  search: string,
  page = 1,
  tag?: string,
  perPage = STORIES_PAGE_SIZE,
): Promise<Paginated<StoryCard>> {
  const query = new URLSearchParams({
    search,
    page: String(page),
    per_page: String(perPage),
  });

  if (tag) {
    query.set("tag", tag);
  }

  const { body } = await apiGet<Paginated<StoryCard>>(`/stories?${query}`);

  if (!body) {
    throw new ApiError("The stories search came back empty.", 502, "/stories");
  }

  return body;
}

/** The newest stories (used by the Our Impact page). */
export async function getLatestStories(limit = 3): Promise<StoryCard[]> {
  "use cache";
  cacheLife(LIVE);
  cacheTag("stories");

  const { body } = await apiGet<Paginated<StoryCard>>(
    `/stories?page=1&per_page=${limit}`,
  );

  return body?.data ?? [];
}

/**
 * The home page's "Latest Stories": stories an editor marked "feature on the home page" first, then
 * the newest others. With nothing featured this is the same list as getLatestStories().
 */
export async function getHomeStories(limit = 3): Promise<StoryCard[]> {
  "use cache";
  cacheLife(LIVE);
  cacheTag("stories");

  const { body } = await apiGet<Paginated<StoryCard>>(
    `/stories?page=1&per_page=${limit}&featured_first=1`,
  );

  return body?.data ?? [];
}

export async function getStory(slug: string): Promise<StoryLookup> {
  "use cache";
  cacheLife(LIVE);
  // "stories" too: prev/next links depend on the rest of the list.
  cacheTag("stories", `story:${slug}`);

  const { status, body } = await apiGet<
    { data: Story } | { redirect_to: string }
  >(`/stories/${encodeURIComponent(slug)}`);

  if (status === 301 && body && "redirect_to" in body) {
    return { kind: "moved", slug: body.redirect_to };
  }

  if (status === 200 && body && "data" in body) {
    return { kind: "found", story: body.data };
  }

  return { kind: "missing" };
}

/** Tags that have at least one public story, most used first. */
export async function getTags(): Promise<Tag[]> {
  "use cache";
  cacheLife(LIVE);
  cacheTag("stories");

  const { body } = await apiGet<{ data: Tag[] }>("/tags");

  return body?.data ?? [];
}

/** Slugs to prerender at build time. Cache Components needs at least one real value. */
export async function getStoryParams(): Promise<{ slug: string }[]> {
  const stories = await getStories(1, 24);
  const params = stories.data.map(({ slug }) => ({ slug }));

  // A brand-new install has no stories yet; the placeholder renders as a 404.
  return params.length > 0 ? params : [{ slug: "placeholder" }];
}

export async function getTagParams(): Promise<{ slug: string }[]> {
  const params = (await getTags()).map(({ slug }) => ({ slug }));

  return params.length > 0 ? params : [{ slug: "placeholder" }];
}

/** Every public story, for the sitemap and feeds (the API caps a page at 24). */
export async function getAllStoryEntries(): Promise<
  { slug: string; published_at: string | null; noindex: boolean }[]
> {
  const entries: {
    slug: string;
    published_at: string | null;
    noindex: boolean;
  }[] = [];
  let page = 1;
  let lastPage = 1;

  do {
    const result = await getStories(page, 24);

    entries.push(
      ...result.data.map(({ slug, published_at, noindex }) => ({
        slug,
        published_at,
        noindex,
      })),
    );
    lastPage = result.meta.last_page;
    page += 1;
  } while (page <= lastPage);

  return entries;
}
