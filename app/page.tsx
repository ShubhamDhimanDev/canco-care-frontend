import type { Metadata } from "next";
import Image from "next/image";

import { DonateButton } from "@/components/layout/donate-button";
import { CharityBand } from "@/components/sections/charity-band";
import { LatestStories } from "@/components/stories/latest-stories";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { HeartTitle } from "@/components/ui/heart-title";
import {
  Eyebrow,
  Lead,
  SectionTitle,
} from "@/components/ui/typography";
import { getHome } from "@/lib/api/home";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} — ${SITE_TAGLINE}` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

const CARD =
  "rounded-[16px] bg-white px-[70px] pb-[50px] text-center shadow-card max-[1300px]:px-9 max-[1300px]:pb-[30px]";

// The pictures that ship with the website; used until an editor chooses one in the admin.
const BUNDLED = {
  hero: {
    src: "/images/homeBannerImg.webp",
    width: 596,
    height: 497,
    alt: "A father hugging his smiling daughter inside a maple-leaf outline",
  },
  cards: [
    {
      src: "/images/projects.webp",
      width: 270,
      height: 271,
      alt: "Smiling community volunteers",
    },
    {
      src: "/images/partnership.webp",
      width: 270,
      height: 271,
      alt: "Hands joined together in partnership",
    },
  ],
} as const;

export default async function HomePage() {
  const home = await getHome();
  const heroImage = home.hero.image ?? {
    url: BUNDLED.hero.src,
    width: BUNDLED.hero.width,
    height: BUNDLED.hero.height,
    alt: BUNDLED.hero.alt,
  };

  return (
    <>
      {/* Hero */}
      <section className="pt-[210px] tablet:pt-[133px]">
        <Container>
          <div className="-mx-3 flex flex-col gap-y-10 md:flex-row md:items-center phone:flex-col-reverse phone:gap-y-0">
            <div className="px-3 md:w-7/12 lg:w-5/12">
              <h1 className="m-0 text-[32px] leading-[44px] font-bold tracking-[4.5px] text-brand-navy phone:text-center max-[385px]:text-[28px] max-[385px]:leading-8">
                {/* The heart replaces the "O" visually; the real word is for assistive technology. */}
                <span className="sr-only">{home.hero.title}</span>
                <span aria-hidden="true">
                  <HeartTitle title={home.hero.title} />
                </span>
              </h1>
              <Lead className="my-[35px] phone:text-center">
                {home.hero.text}
              </Lead>
              <div className="flex items-center gap-5 phone:flex-col">
                <DonateButton label={home.hero.primary_label} />
                <Button href={home.hero.secondary_href}>
                  {home.hero.secondary_label}
                </Button>
              </div>
            </div>

            <div className="relative px-3 md:w-5/12 lg:w-7/12 phone:mb-[30px]">
              <Image
                src={heroImage.url}
                alt={heroImage.alt ?? ""}
                width={heroImage.width ?? BUNDLED.hero.width}
                height={heroImage.height ?? BUNDLED.hero.height}
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
            <Eyebrow>{home.intro.eyebrow}</Eyebrow>
            <h2 className="m-0 text-[72px] leading-[82px] font-bold tracking-[4.5px] text-brand-navy tablet:mt-5 tablet:text-[46px] tablet:leading-8 tablet:tracking-[2.76px] phone:leading-[58px]">
              {home.intro.title}
            </h2>
            <Lead className="mx-auto mt-5 mb-9 max-w-[880px]">
              {home.intro.text}
            </Lead>
            <Button href={home.intro.button_href}>
              {home.intro.button_label}
            </Button>
          </div>

          <div className="mt-[170px] grid grid-cols-1 gap-x-[50px] gap-y-[200px] md:grid-cols-2 md:gap-y-0 tablet:mt-[210px] phone:-mx-3">
            {home.cards.map((card, index) => {
              const fallback = BUNDLED.cards[index] ?? BUNDLED.cards[0];
              const image = card.image ?? {
                url: fallback.src,
                width: fallback.width,
                height: fallback.height,
                alt: fallback.alt,
              };

              return (
                <div key={index} className={CARD}>
                  <Image
                    src={image.url}
                    alt={image.alt ?? ""}
                    width={image.width ?? fallback.width}
                    height={image.height ?? fallback.height}
                    className="mx-auto mb-10 -mt-[148px] h-auto w-[270px]"
                  />
                  <Eyebrow>{card.eyebrow}</Eyebrow>
                  {/* Long words ("PARTNERSHIPS") step down a size on tablet and phone. */}
                  <SectionTitle long={card.title.length > 10}>
                    {card.title}
                  </SectionTitle>
                  <Lead className="m-0 mt-2">{card.text}</Lead>
                </div>
              );
            })}
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
            <Eyebrow>{home.stories.eyebrow}</Eyebrow>
            <SectionTitle
              id="latest-stories"
              fixed
              className="mb-[113px] phone:text-[32px] phone:leading-[38.4px] phone:tracking-[1.92px]"
            >
              {home.stories.title}
            </SectionTitle>
          </div>
          <LatestStories featuredFirst />
        </Container>
      </section>
    </>
  );
}
