import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow, SectionTitle } from "@/components/ui/typography";
import { getSettings } from "@/lib/api/settings";

/**
 * The slate "torn paper" band with the partner logos, the impact blurb and the white stat card that
 * hangs over its bottom edge. Used on the home and impact pages.
 * The page that uses it must leave ~220 px below for the hanging card.
 */
export async function CharityBand() {
  const { impact } = await getSettings();

  return (
    <section
      aria-labelledby="impact-stat"
      className="relative min-h-[460px] bg-[url('/images/blueBg.webp')] bg-cover bg-center bg-no-repeat py-[90px]"
    >
      <Container>
        <div className="mx-auto text-center lg:max-w-[calc((100%+24px)*2/3-24px)]">
          <Image
            src="/images/charityLogos.webp"
            alt="Air for Charity, Make-A-Wish and Canco Cares"
            width={2217}
            height={257}
            className="mx-auto mb-[57px] h-auto w-full"
          />
          <p className="m-0 mb-4 text-center text-[18px] leading-8 font-medium text-white">
            {impact.blurb}
          </p>
        </div>

        <div className="pt-[60px]">
          <div
            id="impact-stat"
            className="absolute bottom-[-150px] left-1/2 flex w-2/3 -translate-x-1/2 lg:w-1/2 flex-col items-center gap-[10px] rounded-[16px] bg-white py-[57px] shadow-card phone:bottom-[-91px] phone:w-auto phone:max-w-[80%] phone:min-w-[80%] phone:px-[25px] phone:pt-[33px] phone:pb-12"
          >
            <Eyebrow className="mb-0">OUR IMPACT</Eyebrow>
            <SectionTitle as="p" fixed className="text-center phone:text-[32px] phone:leading-[38.4px] phone:tracking-[1.92px]">
              {impact.amount_text}
            </SectionTitle>
            <p className="m-0 text-center text-[25px] leading-8 font-bold text-brand-navy">
              {impact.caption}
            </p>
            <Button
              variant="secondary"
              href="/our-impact"
              className="absolute bottom-[-26px] left-1/2 -translate-x-1/2 text-center whitespace-nowrap phone:w-full phone:max-w-[65%]"
            >
              Learn more
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
