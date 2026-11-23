import type { EventCard } from "@/lib/api/types";

/**
 * Event times are printed from the organiser's wall-clock time (`starts_local`, `ends_local`) exactly as
 * the API sends it. Nothing here converts between time zones, so the result cannot depend on the time-zone
 * data of the server's Node/ICU (which is what made events one hour early after BC's 1 Nov 2026 change).
 */

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type WallClock = {
  year: number;
  month: number; // 1–12
  day: number;
  hour: number;
  minute: number;
};

/** "2026-12-01T18:00:00" → its parts. Also accepts a space instead of the "T". */
export function parseWallClock(value: string): WallClock {
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(value);

  if (!match) {
    throw new Error(`Unexpected local time "${value}"`);
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4] ?? 0),
    minute: Number(match[5] ?? 0),
  };
}

/** "Tue, Dec 1, 2026" (the weekday comes from the calendar date, which needs no zone). */
function formatDate({ year, month, day }: WallClock): string {
  const weekday =
    WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];

  return `${weekday}, ${MONTHS[month - 1]} ${day}, ${year}`;
}

/** "6:00 PM" */
function formatTime({ hour, minute }: WallClock): string {
  const suffix = hour >= 12 ? "PM" : "AM";
  const twelve = hour % 12 === 0 ? 12 : hour % 12;

  return `${twelve}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function sameDay(a: WallClock, b: WallClock): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

/**
 * "Sat, Nov 14, 2026 · 6:00 PM – 9:00 PM PT", in the event's own wall-clock time so every visitor
 * reads the time the organisers mean. All-day events show dates only.
 */
export function formatEventWhen(
  event: Pick<
    EventCard,
    "starts_local" | "ends_local" | "timezone_label" | "is_all_day"
  >,
): string {
  const start = parseWallClock(event.starts_local);
  const end = event.ends_local ? parseWallClock(event.ends_local) : null;
  const single = end === null || sameDay(start, end);

  if (event.is_all_day) {
    return end && !single
      ? `${formatDate(start)} – ${formatDate(end)}`
      : formatDate(start);
  }

  const zone = event.timezone_label;

  if (end && single) {
    return `${formatDate(start)} · ${formatTime(start)} – ${formatTime(end)} ${zone}`;
  }

  if (end) {
    return `${formatDate(start)}, ${formatTime(start)} – ${formatDate(end)}, ${formatTime(end)} ${zone}`;
  }

  return `${formatDate(start)} · ${formatTime(start)} ${zone}`;
}

/**
 * Machine-readable start/end for `<time>` and JSON-LD: all-day events are a plain date ("2026-12-01"),
 * timed events the UTC instant the API sends.
 */
export function machineTime(
  event: Pick<EventCard, "starts_local" | "is_all_day">,
  instant: string,
  local: string | null = event.starts_local,
): string {
  return event.is_all_day && local ? local.slice(0, 10) : instant;
}

/** "Community Hall, Kelowna, BC" or "Online". */
export function formatEventPlace(
  event: Pick<EventCard, "location_name" | "city" | "province" | "is_online">,
): string | null {
  const parts = [event.location_name, event.city, event.province].filter(
    Boolean,
  );

  if (parts.length > 0) {
    return parts.join(", ");
  }

  return event.is_online ? "Online" : null;
}
