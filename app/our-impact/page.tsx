import type { Metadata } from "next";
import Image from "next/image";

import { CharityBand } from "@/components/sections/charity-band";
import { LatestStories } from "@/components/stories/latest-stories";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow, Lead, PageTitle } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Our Impact",
  description:
    "Over $80,000 donated to the Make-A-Wish Foundation and counting — see how Canco Cares is changing lives in communities across Canada.",
  alternates: { canonical: "/our-impact" },
};

export default function OurImpactPage() {
  return (
    <>
      <section className="pt-[250px] pb-[54px] tablet:pt-[173px] phone:pt-[128px]">
        <Container>
          <div className="mx-auto text-center md:max-w-[calc((100%+24px)*10/12-24px)]">
            <Eyebrow>Every community deserves</Eyebrow>
            <PageTitle>OUR IMPACT</PageTitle>
            <Lead className="mt-[27px]">
              At Canco Cares, we are already making a significant difference.
              Our efforts have touched the lives of numerous families and
              communities, and this is just the beginning. We have ambitious
              plans for rapid expansion, with the goal of increasing our
              impact each year.
            </Lead>
          </div>
        </Container>
      </section>

      <CharityBand />

      <section className="pt-[230px] pb-[260px] phone:pt-[160px] phone:pb-[220px]">
        <Container>
          <div className="-mx-3 grid grid-cols-1 items-start gap-y-[30px] lg:grid-cols-2">
            <div className="pr-[30px] pl-3 md:mx-auto md:w-2/3 lg:mx-0 lg:w-auto">
              <Image
                src="/images/impactPhoto.webp"
                alt="Canco team members presenting a cheque to the KGH Foundation"
                width={640}
                height={480}
                sizes="(min-width: 992px) 600px, 100vw"
                className="h-auto w-full rounded-[20px]"
              />
            </div>
            <div className="pl-[45px] pr-3 tablet:px-0 phone:mt-5 phone:pl-3 [&>p]:m-0 [&>p]:mb-4 [&>p]:text-[16px] [&>p]:leading-8 [&>p]:font-medium [&>p:nth-child(odd)]:text-[18px] [&>p:nth-child(odd)]:font-bold [&>p:nth-child(odd)]:text-brand-slate-dark">
              <p>
                Our contributions are making a significant impact, showcasing
                the immense value and potential of our work
              </p>
              <p>Each day, we strive to help an increasing number of individuals.</p>
              <p>
                Every person we reach, every life we touch, brings us one step
                closer to our goal.
              </p>
              <p>
                Our primary objective at Canco Cares is to give back to
                communities and families. We are not just an organization; we
                are a movement. A movement that is creating a ripple of
                positive change in our society. Our actions today are sowing
                the seeds for a better tomorrow, a future where compassion and
                community are the cornerstones of societal progress.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section
        aria-label="Latest stories"
        className="relative min-h-[450px] bg-[url('/images/smallBlueBg.webp')] bg-cover bg-center bg-no-repeat py-[70px] phone:min-h-0 phone:bg-none phone:pb-0"
      >
        <Container>
          <div className="-mt-[206px] mb-[70px]">
            <LatestStories />
          </div>
          <div className="text-center">
            <Button
              variant="outline"
              href="/stories"
              className="phone:border-brand-slate phone:text-brand-slate"
            >
              See more stories
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-[54px] phone:pb-[254px]">
        <Container>
          <div className="mx-auto text-center lg:max-w-[calc((100%+24px)*3/4-24px)]">
            <Lead>
              As we continue on this journey, we look forward to sharing our
              progress, celebrating our successes, and acknowledging the
              challenges that inspire us to do better. This is the impact of
              Canco Cares.
            </Lead>
            <h2 className="mt-10 mb-0 text-[28px] leading-[33.6px] font-bold tracking-[1px] text-brand-navy phone:text-[30px] phone:leading-12">
              Together, we are building a legacy of positive change!
            </h2>
          </div>
        </Container>
      </section>
    </>
  );
}
