import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getEvent, getEventParams } from "@/lib/api/events";
import type { Event } from "@/lib/api/types";
import { formatEventPlace, formatEventWhen } from "@/lib/events";
import { SITE_NAME, SITE_URL } from "@/lib/site";

// Events that exist at build time are prerendered; anything published later renders on first visit,
// is cached, and is refreshed by Laravel's revalidation call (tags "events" and "event:{slug}").
export async function generateStaticParams() {
  return getEventParams();
}

function plain(html: string | null): string {
  return (html ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({
  params,
}: PageProps<"/upcoming-events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const result = await getEvent(slug);

  if (result.kind !== "found") {
    return { title: "Event not found", robots: { index: false } };
  }

  const { event } = result;
  const title = event.meta_title ?? event.title;
  const description = event.meta_description ?? event.summary;

  return {
    title,
    description,
    alternates: { canonical: `/upcoming-events/${event.slug}` },
    openGraph: {
      type: "website",
      title,
      description,
      images: event.image
        ? [
            {
              url: event.image.url,
              width: event.image.width ?? undefined,
              height: event.image.height ?? undefined,
              alt: event.image.alt ?? event.title,
            },
          ]
        : undefined,
    },
    twitter: { card: event.image ? "summary_large_image" : "summary" },
  };
}

/** Schema.org `Event` so search engines can show the date, place and status. */
function eventJsonLd(event: Event) {
  const url = `${SITE_URL}/upcoming-events/${event.slug}`;
  const online = event.is_online;
  const physical = Boolean(event.location_name || event.address || event.city);

  const place = physical
    ? {
        "@type": "Place",
        name: event.location_name ?? event.city ?? undefined,
        address: {
          "@type": "PostalAddress",
          streetAddress:
            [event.address?.line1, event.address?.line2]
              .filter(Boolean)
              .join(", ") || undefined,
          addressLocality: event.address?.city ?? event.city ?? undefined,
          addressRegion: event.address?.province ?? event.province ?? undefined,
          postalCode: event.address?.postal_code ?? undefined,
          addressCountry: "CA",
        },
      }
    : undefined;

  const location =
    online && physical
      ? [place, { "@type": "VirtualLocation", url: event.online_url }]
      : online
        ? { "@type": "VirtualLocation", url: event.online_url }
        : place;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.meta_description ?? event.summary,
    startDate: event.starts_at,
    endDate: event.ends_at ?? undefined,
    eventStatus:
      event.status === "cancelled"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode:
      online && physical
        ? "https://schema.org/MixedEventAttendanceMode"
        : online
          ? "https://schema.org/OnlineEventAttendanceMode"
          : "https://schema.org/OfflineEventAttendanceMode",
    location,
    image: event.image?.url,
    url,
    organizer: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    offers:
      event.registration_url && /^free/i.test(event.cost_note ?? "")
        ? {
            "@type": "Offer",
            url: event.registration_url,
            price: "0",
            priceCurrency: "CAD",
            availability: "https://schema.org/InStock",
          }
        : undefined,
  };
}

export default async function EventPage({
  params,
}: PageProps<"/upcoming-events/[slug]">) {
  const { slug } = await params;
  const result = await getEvent(slug);

  if (result.kind === "moved") {
    permanentRedirect(`/upcoming-events/${result.slug}`);
  }

  if (result.kind === "missing") {
    notFound();
  }

  const { event } = result;
  const place = formatEventPlace(event);
  const cancelled = event.status === "cancelled";
  const addressLines = event.address
    ? [
        event.address.line1,
        event.address.line2,
        [event.address.city, event.address.province, event.address.postal_code]
          .filter(Boolean)
          .join(" "),
      ].filter(Boolean)
    : [];
  const mapQuery = [event.location_name, ...addressLines]
    .filter(Boolean)
    .join(", ");
  const description = plain(event.description);

  return (
    <article className="pt-[253px] pb-[116px] tablet:pt-[176px] phone:pt-[138px]">
      <Container>
        <div className="mx-auto md:max-w-[calc((100%+24px)*11/12-24px)] lg:max-w-[calc((100%+24px)*2/3-24px)]">
          {event.image && (
            <Image
              src={event.image.url}
              alt={event.image.alt ?? ""}
              width={event.image.width ?? 600}
              height={event.image.height ?? 400}
              priority
              sizes="(min-width: 992px) 514px, (min-width: 768px) 382px, 260px"
              className="mx-auto block h-[300px] w-[60%] rounded-[16px] object-cover object-center shadow-card phone:h-[200px] phone:w-[85%]"
            />
          )}

          <div className="px-10 pb-10 phone:px-5">
            <header className="mt-[30px] text-center phone:mt-5">
              {cancelled && (
                <p
                  role="status"
                  className="mx-auto mb-4 w-fit rounded-full bg-ink px-4 py-1 text-[13px] font-bold tracking-[1.5px] text-white uppercase"
                >
                  This event has been cancelled
                </p>
              )}
              <h1 className="m-0 text-[30px] leading-[46px] font-bold text-brand-slate phone:text-[24px] phone:leading-9">
                {event.title}
              </h1>
              <p className="mt-3 mb-0 text-[16px] leading-7 font-semibold text-brand-navy">
                <time dateTime={event.starts_at}>{formatEventWhen(event)}</time>
              </p>
              {event.cost_note && (
                <p className="mt-1 mb-0 text-[14px] font-medium text-ink">
                  {event.cost_note}
                </p>
              )}
            </header>

            <section
              aria-label="Where"
              className="mt-6 rounded-[12px] bg-white px-5 py-4 text-center shadow-card"
            >
              <p className="m-0 text-[12px] font-bold tracking-[1.5px] text-brand-slate uppercase">
                Where
              </p>
              <p className="m-0 mt-1 text-[16px] leading-7 font-medium text-ink">
                {event.location_name ?? place}
                {addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </p>
              <p className="m-0 mt-2 flex flex-wrap justify-center gap-x-5 gap-y-1 text-[14px] font-semibold text-brand-slate-dark">
                {mapQuery && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                  >
                    Open in Maps
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
                {event.online_url && (
                  <a
                    href={event.online_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4"
                  >
                    Join online
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </p>
            </section>

            {!cancelled && (
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                {event.registration_url && (
                  <Button
                    variant="secondary"
                    href={event.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Register
                    <span className="sr-only"> (opens in a new tab)</span>
                  </Button>
                )}
                <Button
                  variant="primary"
                  href={`/upcoming-events/${event.slug}/calendar.ics`}
                  download
                  prefetch={false}
                >
                  Add to calendar
                </Button>
              </div>
            )}

            {description && (
              <div
                className="story-body mt-8"
                // Sanitised HTML from the Laravel admin (ADR-001).
                dangerouslySetInnerHTML={{ __html: event.description ?? "" }}
              />
            )}

            <p className="mt-12 mb-0 text-center">
              <Link
                href="/upcoming-events"
                className="text-[16px] font-semibold text-brand-slate-dark underline underline-offset-4"
              >
                All events
              </Link>
            </p>
          </div>
        </div>
      </Container>

      <script
        type="application/ld+json"
        // "<" is escaped so event text can never close the script tag.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventJsonLd(event)).replace(/</g, "\\u003c"),
        }}
      />
    </article>
  );
}
