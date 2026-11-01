import type { EventCard } from "@/lib/api/types";

const DATE = (timeZone: string) =>
  new Intl.DateTimeFormat("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone,
  });

const TIME = (timeZone: string) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  });

function zoneAbbreviation(date: Date, timeZone: string): string {
  return (
    new Intl.DateTimeFormat("en-US", { timeZoneName: "short", timeZone })
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value ?? ""
  );
}

/** The calendar day of an instant in a zone, as "2026-11-14" (for comparing days). */
function dayKey(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone,
  }).format(date);
}

/**
 * "Sat, Nov 14, 2026 · 6:00 – 9:00 PM PST", always in the event's own time zone so every visitor
 * reads the time the organisers mean. All-day events show dates only.
 */
export function formatEventWhen(
  event: Pick<EventCard, "starts_at" | "ends_at" | "timezone" | "is_all_day">,
): string {
  const zone = event.timezone;
  const start = new Date(event.starts_at);
  const end = event.ends_at ? new Date(event.ends_at) : null;
  const sameDay = end !== null && dayKey(start, zone) === dayKey(end, zone);

  if (event.is_all_day) {
    return end && !sameDay
      ? `${DATE(zone).format(start)} – ${DATE(zone).format(end)}`
      : DATE(zone).format(start);
  }

  const abbreviation = zoneAbbreviation(start, zone);

  if (end && sameDay) {
    return `${DATE(zone).format(start)} · ${TIME(zone).format(start)} – ${TIME(zone).format(end)} ${abbreviation}`;
  }

  if (end) {
    return `${DATE(zone).format(start)}, ${TIME(zone).format(start)} – ${DATE(zone).format(end)}, ${TIME(zone).format(end)} ${abbreviation}`;
  }

  return `${DATE(zone).format(start)} · ${TIME(zone).format(start)} ${abbreviation}`;
}

/** "Community Hall, Kelowna, BC" or "Online". */
export function formatEventPlace(
  event: Pick<
    EventCard,
    "location_name" | "city" | "province" | "is_online"
  >,
): string | null {
  const parts = [
    event.location_name,
    event.city,
    event.province,
  ].filter(Boolean);

  if (parts.length > 0) {
    return parts.join(", ");
  }

  return event.is_online ? "Online" : null;
}
