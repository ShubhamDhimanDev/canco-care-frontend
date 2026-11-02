import Image from "next/image";

import { Button } from "@/components/ui/button";
import type { EventCard as EventCardData } from "@/lib/api/types";
import { formatEventPlace, formatEventWhen } from "@/lib/events";
import { cn } from "@/lib/utils";

/**
 * An event teaser in the same visual language as a story card: the photo lifted over the top edge,
 * details, and an orange button hanging over the bottom edge. Cancelled events are flagged; past
 * events are muted and have no call to action.
 */
export function EventCard({
  event,
  past = false,
}: {
  event: EventCardData;
  past?: boolean;
}) {
  const place = formatEventPlace(event);
  const cancelled = event.status === "cancelled";

  return (
    <article
      className={cn(
        "relative flex h-full flex-col items-center justify-center gap-4 rounded-[16px] bg-white px-[43px] pb-[53px] shadow-card tablet:px-[27px] tablet:pb-[46px]",
        past && "opacity-80",
      )}
    >
      {event.image ? (
        <Image
          src={event.image.url}
          alt={event.image.alt ?? ""}
          width={event.image.width ?? 600}
          height={event.image.height ?? 400}
          sizes="(min-width: 992px) 322px, (min-width: 576px) 50vw, 100vw"
          className="-mt-[50px] h-[197px] w-full rounded-[16px] object-cover object-center shadow-card"
        />
      ) : (
        <div className="h-[50px]" aria-hidden="true" />
      )}

      {(cancelled || event.is_featured) && (
        <p
          className={cn(
            "m-0 rounded-full px-3 py-1 text-[12px] font-bold tracking-[1.5px] uppercase",
            cancelled
              ? "bg-ink text-white"
              : "bg-brand-slate/10 text-brand-slate-dark",
          )}
        >
          {cancelled ? "Cancelled" : "Featured"}
        </p>
      )}

      <h3 className="m-0 text-center text-[22px] leading-8 font-bold text-brand-slate">
        {event.title}
      </h3>
      <p className="m-0 text-center text-[14px] leading-6 font-semibold text-brand-navy">
        <time dateTime={event.starts_at}>{formatEventWhen(event)}</time>
        {place && (
          <>
            <br />
            {place}
          </>
        )}
        {event.cost_note && (
          <>
            <br />
            {event.cost_note}
          </>
        )}
      </p>
      <p className="m-0 text-center text-[14px] leading-6 font-medium text-ink">
        {event.summary}
      </p>

      {!past && (
        <Button
          variant="secondary"
          href={`/upcoming-events/${event.slug}`}
          aria-label={`Learn more: ${event.title}`}
          className="absolute bottom-[-27px] left-1/2 w-full max-w-[50%] -translate-x-1/2 text-center tablet:max-w-[70%]"
        >
          Learn more
        </Button>
      )}
    </article>
  );
}

/** Responsive grid of event cards (3 / 2 / 1 columns); the row gap leaves room for the hanging buttons. */
export function EventGrid({
  events,
  past = false,
}: {
  events: EventCardData[];
  past?: boolean;
}) {
  return (
    <ul className="m-0 flex list-none flex-wrap justify-center gap-x-6 gap-y-[120px] p-0">
      {events.map((event) => (
        <li
          key={event.slug}
          className="w-[calc(100%-24px)] max-w-[408px] md:w-[324px] md:max-w-none lg:w-[408px]"
        >
          <EventCard event={event} past={past} />
        </li>
      ))}
    </ul>
  );
}
