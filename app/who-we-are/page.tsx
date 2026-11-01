import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { Eyebrow, SectionTitle } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Who We Are",
  description:
    "Our mission, vision and values: bridging businesses and communities to create a ripple of positive change across Canada.",
  alternates: { canonical: "/who-we-are" },
};

function CareBox({
  image,
  alt,
  eyebrow,
  title,
  long,
  children,
}: {
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  long?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[16px] bg-white px-[70px] pb-[50px] text-center shadow-card tablet:px-9 tablet:pb-[30px]">
      <Image
        src={image}
        alt={alt}
        width={270}
        height={271}
        className="mx-auto mb-10 -mt-[148px] h-auto w-[270px]"
      />
      <Eyebrow>{eyebrow}</Eyebrow>
      <SectionTitle long={long}>{title}</SectionTitle>
      <div className="mt-2 text-left [&>p]:mb-5 [&>p]:text-[16px] [&>p]:leading-[30px] [&>p]:font-medium [&>p:first-child]:text-center [&>p:first-child]:text-[18px] [&>p:first-child]:font-bold">
        {children}
      </div>
    </div>
  );
}

function ValueItem({
  icon,
  size,
  name,
  last,
  children,
}: {
  icon: string;
  /** Intrinsic [width, height] of the icon file, so the layout does not shift while it loads. */
  size: [number, number];
  name: string;
  last?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative text-center lg:px-[90px] tablet:w-1/2 phone:w-full",
        // Vertical dashed connector between stacked values (tablet and phone).
        !last &&
          "tablet:after:absolute tablet:after:right-1/2 tablet:after:-bottom-[51px] tablet:after:h-[29px] tablet:after:w-0.5 tablet:after:translate-x-1/2 tablet:after:border-l-[3px] tablet:after:border-dashed tablet:after:border-brand-slate tablet:after:content-['']",
      )}
    >
      <Image
        src={icon}
        alt=""
        width={size[0]}
        height={size[1]}
        className="mx-auto mb-[30px] h-auto w-[140px]"
      />
      <h3 className="mx-0 mt-0 mb-[26px] text-[46px] leading-8 font-bold tracking-[0.92px] text-brand-slate-dark tablet:text-[40px]">
        {name}
      </h3>
      <p className="m-0 text-[18px] leading-[34px] font-medium">{children}</p>
    </div>
  );
}

/** A dashed line joining the two values of a row (desktop only). */
function Connector() {
  return (
    <span
      aria-hidden="true"
      className="absolute top-[25%] left-1/2 hidden h-1 w-[250px] -translate-x-1/2 border-t-4 border-dashed border-brand-slate lg:block"
    />
  );
}

export default function WhoWeArePage() {
  return (
    <div className="pt-[180px] pb-[200px] tablet:pt-[99px]">
      {/* The live page had no <h1>; screen readers get one here. */}
      <h1 className="sr-only">Who We Are</h1>

      <section className="pt-[243px] pb-[70px] tablet:pt-[37px] phone:pb-0">
        <Container>
          <div className="grid grid-cols-1 gap-x-[50px] gap-y-[200px] pt-0 tablet:pt-[210px] md:grid-cols-2 md:gap-y-0 phone:-mx-3 phone:pt-[140px]">
            <div className="relative">
              <CareBox
                image="/images/careMission.webp"
                alt="A hand holding a red heart"
                eyebrow="Our"
                title="MISSION"
                long
              >
                <p>
                  At Canco Cares, we believe in the transformative power of
                  compassion and community.
                </p>
                <p>
                  Our mission is to create a ripple of positive change in our
                  society, bridging the gap between businesses and
                  communities. We inspire our employees and customers to
                  extend their hands in service to the communities that we
                  cherish, the places we call home.
                </p>
                <p>
                  Through strategic partnerships, we ignite sparks of hope and
                  progress that will echo into the future, touching lives for
                  generations to come. We are more than a name, we are a
                  movement. A movement committed to nurturing a better
                  tomorrow, embodying the heartfelt spirit of caring that is
                  the essence of our Canadian identity.
                </p>
              </CareBox>
              <Image
                src="/images/carePurple.webp"
                alt=""
                width={297}
                height={222}
                aria-hidden="true"
                className="mx-auto mt-[76px] hidden h-auto w-[297px] lg:block"
              />
              {/* Dashed arc from the logo mark down to "VALUES". */}
              <svg
                aria-hidden="true"
                viewBox="0 0 80 190"
                className="absolute bottom-[-335px] left-[155px] hidden h-[190px] w-20 lg:block"
                fill="none"
              >
                <path
                  d="M62 2C8 40 -4 130 52 186"
                  stroke="#666c91"
                  strokeWidth="2"
                  strokeDasharray="6 8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <CareBox
              image="/images/careVision.webp"
              alt="Two men sharing a warm embrace"
              eyebrow="Strategic"
              title="PARTNERSHIPS"
              long
            >
              <p>
                At Canco Cares, we aim to create a future where compassion and
                community are the cornerstones of societal progress.
              </p>
              <p>
                We dream of a world where every individual, regardless of
                their circumstances, is empowered to thrive and make a
                meaningful contribution to their community. In the near
                future, we see ourselves expanding our reach, touching more
                lives, and strengthening the fabric of our community. We aim
                to build strong partnerships that align with our mission,
                fostering a network of support and collaboration. We are
                committed to enhancing our sustainability, ensuring our
                efforts today lead to lasting positive change. Above all, we
                strive to promote inclusivity, creating a space where everyone
                feels seen, heard, and valued.
              </p>
              <p>
                As we look further into the future, we aspire to deepen our
                impact, becoming a beacon of hope and resilience in our
                community. We envision ourselves leading through partnerships,
                championing sustainability, and fostering a culture of
                inclusivity. Our dream is to leave a lasting legacy, a ripple
                of positive change that inspires hope and resilience in
                generations to come. This is the world we are committed to
                helping build, a world that truly embodies the heartfelt
                spirit of our Canadian identity.
              </p>
            </CareBox>
          </div>
        </Container>
      </section>

      <section aria-labelledby="values" className="pb-20 phone:pb-0">
        <Container className="flex flex-col gap-[70px]">
          <div className="text-center">
            <Image
              src="/images/carePurple.webp"
              alt=""
              width={297}
              height={222}
              aria-hidden="true"
              sizes="(min-width: 768px) 468px, 215px"
              className="mx-auto mt-[76px] mb-[95px] block h-auto w-[calc((100%+24px)*0.65)] max-w-none lg:hidden"
            />
            <Eyebrow>Our</Eyebrow>
            <SectionTitle
              id="values"
              className="tablet:text-[46px] tablet:leading-[55.2px] tablet:tracking-[2px]"
            >
              VALUES
            </SectionTitle>
            <p className="mt-2 mb-0 text-[18px] leading-[34px] font-semibold lg:-mx-3 lg:px-[90px]">
              At Canco Cares, our values are the guiding principles
              <br />
              that inspire and direct our work:
            </p>
          </div>

          <div className="relative -mx-3 flex flex-col items-center gap-[70px] lg:grid lg:grid-cols-2 lg:items-start lg:gap-0">
            <Connector />
            <ValueItem icon="/images/compassion.webp" size={[462, 444]} name="Compassion">
              We believe in the power of empathy and understanding, always
              approaching our work with kindness and respect for the
              individuals and communities we serve.
            </ValueItem>
            <ValueItem icon="/images/community.webp" size={[452, 462]} name="Community">
              We value the strength and spirit of community. We strive to
              foster connections and build relationships that strengthen our
              collective ability to make a difference.
            </ValueItem>
          </div>

          <div className="relative -mx-3 flex flex-col items-center gap-[70px] lg:grid lg:grid-cols-2 lg:items-start lg:gap-0">
            <Connector />
            <ValueItem icon="/images/empowerment.webp" size={[419, 461]} name="Empowerment">
              We are committed to empowering individuals, enabling them to
              overcome challenges and reach their full potential.
            </ValueItem>
            <ValueItem icon="/images/sustainability.webp" size={[395, 461]} name="Sustainability">
              We are dedicated to creating solutions that are sustainable,
              ensuring our efforts lead to lasting positive change.
            </ValueItem>
          </div>

          <div className="relative -mx-3 flex flex-col items-center gap-[70px] lg:grid lg:grid-cols-2 lg:items-start lg:gap-0">
            <Connector />
            <ValueItem icon="/images/inclusivity.webp" size={[439, 420]} name="Inclusivity">
              We believe in the importance of inclusivity, ensuring everyone
              has the opportunity to thrive, regardless of their
              circumstances.
            </ValueItem>
            <ValueItem icon="/images/legacy.webp" size={[409, 420]} name="Legacy" last>
              We are driven by the desire to leave a positive legacy,
              inspiring hope and resilience in generations to come.
            </ValueItem>
          </div>
        </Container>
      </section>
    </div>
  );
}
