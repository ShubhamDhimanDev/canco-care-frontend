import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { LIVE_EVENTS } from "@/lib/api/cache";
import { apiGet, ApiError } from "@/lib/api/client";
import type { Event, EventCard, EventLookup, Paginated } from "@/lib/api/types";

// Cached with the "events" tag; Laravel revalidates it whenever an event is saved. Lists also expire
// within the hour on their own because "upcoming" changes as time passes, not only when an editor saves.

export const EVENTS_PAGE_SIZE = 9;

export type EventScope = "upcoming" | "past" | "all";

export async function getEvents(
  scope: EventScope = "upcoming",
  page = 1,
  perPage = EVENTS_PAGE_SIZE,
): Promise<Paginated<EventCard>> {
  "use cache";
  cacheLife(LIVE_EVENTS);
  cacheTag("events");

  const query = new URLSearchParams({
    scope,
    page: String(page),
    per_page: String(perPage),
  });

  if (scope === "upcoming") {
    query.set("featured_first", "1");
  }

  const { body } = await apiGet<Paginated<EventCard>>(`/events?${query}`);

  if (!body) {
    throw new ApiError("The events list came back empty.", 502, "/events");
  }

  return body;
}

/** A visitor's search (title, summary, venue, city). Not cached, for the same reason as searchStories(). */
export async function searchEvents(
  search: string,
  scope: EventScope = "upcoming",
  page = 1,
  perPage = EVENTS_PAGE_SIZE,
): Promise<Paginated<EventCard>> {
  const query = new URLSearchParams({
    search,
    scope,
    page: String(page),
    per_page: String(perPage),
  });

  const { body } = await apiGet<Paginated<EventCard>>(`/events?${query}`);

  if (!body) {
    throw new ApiError("The events search came back empty.", 502, "/events");
  }

  return body;
}

export async function getEvent(slug: string): Promise<EventLookup> {
  "use cache";
  cacheLife(LIVE_EVENTS);
  cacheTag("events", `event:${slug}`);

  const { status, body } = await apiGet<
    { data: Event } | { redirect_to: string }
  >(`/events/${encodeURIComponent(slug)}`);

  if (status === 301 && body && "redirect_to" in body) {
    return { kind: "moved", slug: body.redirect_to };
  }

  if (status === 200 && body && "data" in body) {
    return { kind: "found", event: body.data };
  }

  return { kind: "missing" };
}

/** Slugs to prerender at build time. Cache Components needs at least one real value. */
export async function getEventParams(): Promise<{ slug: string }[]> {
  const events = await getEvents("all", 1, 24);
  const params = events.data.map(({ slug }) => ({ slug }));

  return params.length > 0 ? params : [{ slug: "placeholder" }];
}

/** Every public event, for the sitemap (the API caps a page at 24). */
export async function getAllEventEntries(): Promise<{ slug: string }[]> {
  const entries: { slug: string }[] = [];
  let page = 1;
  let lastPage = 1;

  do {
    const result = await getEvents("all", page, 24);

    entries.push(...result.data.map(({ slug }) => ({ slug })));
    lastPage = result.meta.last_page;
    page += 1;
  } while (page <= lastPage);

  return entries;
}
