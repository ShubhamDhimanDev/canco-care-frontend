import type { Metadata } from "next";
import Image from "next/image";

import { DonateButton } from "@/components/layout/donate-button";
import { CharityBand } from "@/components/sections/charity-band";
import { LatestStories } from "@/components/stories/latest-stories";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { HeartO } from "@/components/ui/heart-o";
import {
  Eyebrow,
  Lead,
  SectionTitle,
} from "@/components/ui/typography";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} — ${SITE_TAGLINE}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

const CARD =
  "rounded-[16px] bg-white px-[70px] pb-[50px] text-center shadow-card max-[1300px]:px-9 max-[1300px]:pb-[30px]";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-[210px] tablet:pt-[133px]">
        <Container>
          <div className="-mx-3 flex flex-col gap-y-10 md:flex-row md:items-center phone:flex-col-reverse phone:gap-y-0">
            <div className="px-3 md:w-7/12 lg:w-5/12">
              <h1 className="m-0 text-[32px] leading-[44px] font-bold tracking-[4.5px] text-brand-navy phone:text-center max-[385px]:text-[28px] max-[385px]:leading-8">
                {/* The heart replaces the "O" visually; the real word is for assistive technology. */}
                <span className="sr-only">Fueling Hope Across Canada</span>
                <span aria-hidden="true">
                  FUELING H<HeartO />
                  PE ACROSS CANADA
                </span>
              </h1>
              <Lead className="my-[35px] phone:text-center">
                Together, we can uplift our local communities and create
                lasting change. Your support helps make a meaningful impact -
                join us in making a difference today!
              </Lead>
              <div className="flex items-center gap-5 phone:flex-col">
                <DonateButton />
                <Button href="/partner-with-us">Partner with us</Button>
              </div>
            </div>

            <div className="relative px-3 md:w-5/12 lg:w-7/12 phone:mb-[30px]">
              <Image
                src="/images/homeBannerImg.webp"
                alt="A father hugging his smiling daughter inside a maple-leaf outline"
                width={596}
                height={497}
                priority
                sizes="(min-width: 992px) 596px, (min-width: 768px) 276px, 100vw"
                className="ml-auto block h-auto w-full max-w-[596px] phone:mx-auto"
              />
              <Image
                src="/images/bigHeartIcon.webp"
                alt=""
                width={595}
                height={509}
                aria-hidden="true"
                className="absolute right-[52px] bottom-[-36px] h-auto w-[190px] tablet:hidden"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Intro + the two cards */}
      <section className="mt-[66px] pb-[70px] tablet:mt-[37px]">
        <Container>
          <div className="text-center">
            <Eyebrow>Every community deserves</Eyebrow>
            <h2 className="m-0 text-[72px] leading-[82px] font-bold tracking-[4.5px] text-brand-navy tablet:mt-5 tablet:text-[46px] tablet:leading-8 tablet:tracking-[2.76px] phone:leading-[58px]">
              CANCO CARES
            </h2>
            <Lead className="mx-auto mt-5 mb-9 max-w-[880px]">
              In Canada, numerous communities face various challenges, and
              many individuals and families need support to thrive. Canco
              Cares is here to bridge this gap. Our programs across the
              country aim to provide communities with the resources they need
              to prosper.
            </Lead>
            <Button href="/who-we-are">Learn more</Button>
          </div>

          <div className="mt-[170px] grid grid-cols-1 gap-x-[50px] gap-y-[200px] md:grid-cols-2 md:gap-y-0 tablet:mt-[210px] phone:-mx-3">
            <div className={CARD}>
              <Image
                src="/images/projects.webp"
                alt="Smiling community volunteers"
                width={270}
                height={271}
                className="mx-auto mb-10 -mt-[148px] h-auto w-[270px]"
              />
              <Eyebrow>Community</Eyebrow>
              <SectionTitle>PROJECTS</SectionTitle>
              <Lead className="m-0 mt-2">
                Our Community Projects span across the country, each one
                aimed at fostering compassion and progress in our local
                communities.
              </Lead>
            </div>
            <div className={CARD}>
              <Image
                src="/images/partnership.webp"
                alt="Hands joined together in partnership"
                width={270}
                height={271}
                className="mx-auto mb-10 -mt-[148px] h-auto w-[270px]"
              />
              <Eyebrow>Strategic</Eyebrow>
              <SectionTitle long>PARTNERSHIPS</SectionTitle>
              <Lead className="m-0 mt-2">
                We&apos;ve built strong relationships with strategic partners
                who align with our mission, helping us extend our reach and
                impact.
              </Lead>
            </div>
          </div>
        </Container>
      </section>

      <CharityBand />

      {/* Latest stories */}
      <section
        aria-labelledby="latest-stories"
        className="mt-[218px] pb-[200px] phone:mt-[150px]"
      >
        <Container>
          <div className="text-center">
            <Eyebrow>In Community</Eyebrow>
            <SectionTitle
              id="latest-stories"
              fixed
              className="mb-[113px] phone:text-[32px] phone:leading-[38.4px] phone:tracking-[1.92px]"
            >
              LATEST STORIES
            </SectionTitle>
          </div>
          <LatestStories />
        </Container>
      </section>
    </>
  );
}
