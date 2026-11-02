import type { Event } from "@/lib/api/types";
import { SITE_NAME, SITE_URL } from "@/lib/site";

/** Escapes text values per RFC 5545 §3.3.11. */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Folds a content line to 75 octets, continuing with a leading space (RFC 5545 §3.1). */
function fold(line: string): string {
  const bytes = new TextEncoder();

  if (bytes.encode(line).length <= 75) {
    return line;
  }

  const parts: string[] = [];
  let current = "";

  for (const char of line) {
    const limit = parts.length === 0 ? 75 : 74;

    if (bytes.encode(current + char).length > limit) {
      parts.push(current);
      current = char;
    } else {
      current += char;
    }
  }

  parts.push(current);

  return parts.join("\r\n ");
}

/** "20261114T020000Z" */
function utc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** The event's calendar date in its own zone, "20261114". */
function localDate(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone,
  })
    .format(date)
    .replaceAll("-", "");
}

function plainText(html: string | null): string {
  return (html ?? "")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** A single-event iCalendar file: opens in Apple Calendar, Outlook and Google Calendar. */
export function buildIcs(event: Event, now = new Date()): string {
  const start = new Date(event.starts_at);
  const end = event.ends_at ? new Date(event.ends_at) : null;
  const url = `${SITE_URL}/upcoming-events/${event.slug}`;

  const address = event.address
    ? [
        event.address.line1,
        event.address.line2,
        event.address.city,
        event.address.province,
        event.address.postal_code,
      ].filter(Boolean)
    : [];
  const location = [event.location_name, ...address].filter(Boolean).join(", ");

  const description = [event.summary, plainText(event.description), url]
    .filter(Boolean)
    .join("\n\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${SITE_NAME}//Events//EN`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.slug}@${new URL(SITE_URL).hostname}`,
    `DTSTAMP:${utc(now)}`,
  ];

  if (event.is_all_day) {
    // All-day events use dates, and DTEND is exclusive (the day after the last day).
    const last = end ?? start;
    const dayAfter = new Date(last.getTime() + 24 * 60 * 60 * 1000);

    lines.push(
      `DTSTART;VALUE=DATE:${localDate(start, event.timezone)}`,
      `DTEND;VALUE=DATE:${localDate(dayAfter, event.timezone)}`,
    );
  } else {
    lines.push(`DTSTART:${utc(start)}`);
    // No end given: assume a two-hour event so calendars do not show a zero-length block.
    lines.push(
      `DTEND:${utc(end ?? new Date(start.getTime() + 2 * 60 * 60 * 1000))}`,
    );
  }

  lines.push(
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(description)}`,
  );

  if (location) {
    lines.push(`LOCATION:${escapeText(location)}`);
  }

  lines.push(
    `URL:${url}`,
    `STATUS:${event.status === "cancelled" ? "CANCELLED" : "CONFIRMED"}`,
    "END:VEVENT",
    "END:VCALENDAR",
  );

  return `${lines.map(fold).join("\r\n")}\r\n`;
}
