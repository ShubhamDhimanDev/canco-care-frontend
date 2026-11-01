import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { Eyebrow, Lead, PageTitle } from "@/components/ui/typography";
import { INSTAGRAM_HANDLE, SOCIAL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Upcoming Events",
  description:
    "Fundraisers and community events you can join, support or volunteer at with Canco Cares.",
  alternates: { canonical: "/upcoming-events" },
};

// Events are not built yet (docs/plan/06-feature-events.md). Until then this page keeps the live
// site's intro and Instagram link, and says plainly that nothing is scheduled.
export default function UpcomingEventsPage() {
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
          <p className="mt-[50px] mb-0 text-[20px] leading-8 font-medium">
            There are no events scheduled right now. Check back soon, or follow
            us to hear about new ones first.
          </p>
        </section>

        <section className="pt-[50px] pb-[78px] text-center phone:pb-[38px]" aria-labelledby="instagram">
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
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
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
