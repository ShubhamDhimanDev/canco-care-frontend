import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { EventGrid } from "@/components/events/event-card";
import { Container } from "@/components/ui/container";
import { Eyebrow, Lead, PageTitle } from "@/components/ui/typography";
import { getEvents } from "@/lib/api/events";
import { INSTAGRAM_HANDLE, SOCIAL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Upcoming Events",
  description:
    "Fundraisers and community events you can join, support or volunteer at with Canco Cares.",
  alternates: { canonical: "/upcoming-events" },
};

const PAST_LIMIT = 6;

function EventsSkeleton() {
  return (
    <ul
      aria-busy="true"
      aria-label="Loading events"
      className="m-0 flex list-none flex-wrap justify-center gap-x-6 gap-y-[120px] p-0"
    >
      {[0, 1, 2].map((key) => (
        <li
          key={key}
          className="h-[360px] w-full animate-pulse rounded-[16px] bg-white shadow-card md:w-[324px] lg:w-[408px]"
        />
      ))}
    </ul>
  );
}

/** Reads `?page=` (a runtime value, hence the Suspense boundary above it), then renders from the cached list. */
async function UpcomingEvents({
  searchParams,
}: Pick<PageProps<"/upcoming-events">, "searchParams">) {
  const { page } = await searchParams;
  const raw = Array.isArray(page) ? page[0] : page;
  const current = Math.max(1, Number.parseInt(raw ?? "1", 10) || 1);

  const upcoming = await getEvents("upcoming", current);

  if (upcoming.data.length === 0 && current === 1) {
    return (
      <p className="m-0 text-center text-[20px] leading-8 font-medium">
        No upcoming events right now — follow us on Instagram below or{" "}
        <Link href="/contact-us" className="underline underline-offset-4">
          contact us
        </Link>{" "}
        to hear about new ones first.
      </p>
    );
  }

  if (upcoming.data.length === 0) {
    return (
      <p className="m-0 text-center text-[20px] leading-8 font-medium">
        There are no events on this page.{" "}
        <Link href="/upcoming-events" className="underline underline-offset-4">
          Back to upcoming events
        </Link>
        .
      </p>
    );
  }

  const { meta } = upcoming;

  return (
    <>
      <EventGrid events={upcoming.data} />

      {meta.last_page > 1 && (
        <nav
          aria-label="Events pages"
          className="mt-[100px] flex items-center justify-center gap-6 text-[18px] font-semibold text-brand-slate-dark"
        >
          {current > 1 ? (
            <Link
              rel="prev"
              href={
                current === 2
                  ? "/upcoming-events"
                  : `/upcoming-events?page=${current - 1}`
              }
              className="underline underline-offset-4"
            >
              ← Sooner
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
          <span className="text-ink">
            Page {meta.current_page} of {meta.last_page}
          </span>
          {current < meta.last_page ? (
            <Link
              rel="next"
              href={`/upcoming-events?page=${current + 1}`}
              className="underline underline-offset-4"
            >
              Later →
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
        </nav>
      )}
    </>
  );
}

/** The most recent finished events; hidden entirely when there are none. */
async function PastEvents() {
  const past = await getEvents("past", 1, PAST_LIMIT);

  if (past.data.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="past-events" className="mt-[160px]">
      <h2
        id="past-events"
        className="m-0 mb-[100px] text-center text-[34px] leading-8 font-semibold text-brand-slate phone:text-[28px] phone:leading-[44px]"
      >
        Past events
      </h2>
      <EventGrid events={past.data} past />
    </section>
  );
}

export default function UpcomingEventsPage(
  props: PageProps<"/upcoming-events">,
) {
  return (
    <div className="pt-[250px] pb-[200px] tablet:pt-[173px] phone:pt-[128px]">
      <Container>
        <section className="mx-auto text-center lg:max-w-[calc((100%+24px)*3/4-24px)]">
          <Eyebrow>Upcoming</Eyebrow>
          <PageTitle className="mb-2">EVENTS</PageTitle>
          <Lead className="mb-4">
            Join us in making a difference! Explore our upcoming events and
            find out how you can get involved. Each event is a unique
            opportunity to connect with our community, support our mission,
            and contribute to a brighter future.
          </Lead>
          <Lead className="mb-4">
            From fundraisers to community outreach programs, there’s
            something for everyone. Whether you’re looking to volunteer,
            donate, or simply learn more about our work, our events are a
            great place to start.
          </Lead>
        </section>

        <div className="mt-[100px]">
          <Suspense fallback={<EventsSkeleton />}>
            <UpcomingEvents searchParams={props.searchParams} />
          </Suspense>
          <Suspense fallback={null}>
            <PastEvents />
          </Suspense>
        </div>

        <section
          className="pt-[120px] pb-[78px] text-center phone:pb-[38px]"
          aria-labelledby="instagram"
        >
          <h2
            id="instagram"
            className="m-0 text-[34px] leading-8 font-semibold text-brand-slate phone:text-[28px] phone:leading-[44px]"
          >
            Follow us on Instagram
          </h2>
          <p className="mx-0 mt-[17px] mb-0 flex items-center justify-center gap-3 text-[20px] leading-8 font-semibold text-ink phone:text-[24px] phone:leading-[38px] phone:text-brand-navy">
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 underline-offset-4 hover:underline"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="size-5"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
              {INSTAGRAM_HANDLE}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </section>
      </Container>
    </div>
  );
}
