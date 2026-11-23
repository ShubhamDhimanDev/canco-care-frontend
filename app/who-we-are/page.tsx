import type { Metadata } from "next";
import Image from "next/image";
import { Fragment, type ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { getPage, pageImage, pageText } from "@/lib/api/pages";
import type { ApiImage } from "@/lib/api/types";
import { Eyebrow, SectionTitle } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPage("who-we-are");

  return {
    title: pageText(content, "meta_title"),
    description: pageText(content, "meta_description"),
    alternates: { canonical: "/who-we-are" },
  };
}

type CardImage = { src: string; width: number; height: number; alt: string };

/** The picture an editor chose in the admin, or the one bundled with the website. */
function cardImage(chosen: ApiImage | null, bundled: CardImage): CardImage {
  return chosen
    ? {
        src: chosen.url,
        width: chosen.width ?? bundled.width,
        height: chosen.height ?? bundled.height,
        alt: chosen.alt ?? bundled.alt,
      }
    : bundled;
}

function CareBox({
  image,
  eyebrow,
  title,
  long,
  html,
}: {
  image: CardImage;
  eyebrow: string;
  title: string;
  long?: boolean;
  /** Sanitised by the Laravel app when an editor saves the page. */
  html: string;
}) {
  return (
    <div className="flow-root rounded-[16px] bg-white px-[70px] pb-[50px] text-center shadow-card tablet:px-9 tablet:pb-[30px]">
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className="mx-auto mb-10 -mt-[148px] h-auto w-[270px]"
      />
      <Eyebrow>{eyebrow}</Eyebrow>
      <SectionTitle long={long}>{title}</SectionTitle>
      <div
        className="mt-2 text-left [&>p]:mb-5 [&>p]:text-[16px] [&>p]:leading-[30px] [&>p]:font-medium [&>p:first-child]:text-center [&>p:first-child]:text-[18px] [&>p:first-child]:font-bold"
        dangerouslySetInnerHTML={{ __html: html }}
      />
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

export default async function WhoWeArePage() {
  const c = await getPage("who-we-are");
  const t = (key: string) => pageText(c, key);

  return (
    <div className="pt-[180px] pb-[200px] tablet:pt-[99px]">
      {/* The live page had no <h1>; screen readers get one here. */}
      <h1 className="sr-only">Who We Are</h1>

      <section className="pt-[243px] pb-[70px] tablet:pt-[37px] phone:pb-0">
        <Container>
          <div className="grid grid-cols-1 gap-x-[50px] gap-y-[200px] pt-0 tablet:pt-[210px] md:grid-cols-2 md:gap-y-0 phone:-mx-3 phone:pt-[140px]">
            <div className="relative">
              <CareBox
                image={cardImage(pageImage(c, "mission_image"), {
                  src: "/images/careMission.webp",
                  width: 270,
                  height: 271,
                  alt: "A hand holding a red heart",
                })}
                eyebrow={t("mission_eyebrow")}
                title={t("mission_title")}
                long
                html={t("mission_body")}
              />
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
              image={cardImage(pageImage(c, "vision_image"), {
                src: "/images/careVision.webp",
                width: 270,
                height: 271,
                alt: "Two men sharing a warm embrace",
              })}
              eyebrow={t("vision_eyebrow")}
              title={t("vision_title")}
              long
              html={t("vision_body")}
            />
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
            <Eyebrow>{t("values_eyebrow")}</Eyebrow>
            <SectionTitle
              id="values"
              className="tablet:text-[46px] tablet:leading-[55.2px] tablet:tracking-[2px]"
            >
              {t("values_title")}
            </SectionTitle>
            <p className="mt-2 mb-0 text-[18px] leading-[34px] font-semibold lg:-mx-3 lg:px-[90px]">
              {t("values_intro")
                .split("\n")
                .map((line, index) => (
                  <Fragment key={index}>
                    {index > 0 && <br />}
                    {line}
                  </Fragment>
                ))}
            </p>
          </div>

          <div className="relative -mx-3 flex flex-col items-center gap-[70px] lg:grid lg:grid-cols-2 lg:items-start lg:gap-0">
            <Connector />
            <ValueItem
              icon="/images/compassion.webp"
              size={[462, 444]}
              name={t("value_1_name")}
            >
              {t("value_1_text")}
            </ValueItem>
            <ValueItem
              icon="/images/community.webp"
              size={[452, 462]}
              name={t("value_2_name")}
            >
              {t("value_2_text")}
            </ValueItem>
          </div>

          <div className="relative -mx-3 flex flex-col items-center gap-[70px] lg:grid lg:grid-cols-2 lg:items-start lg:gap-0">
            <Connector />
            <ValueItem
              icon="/images/empowerment.webp"
              size={[419, 461]}
              name={t("value_3_name")}
            >
              {t("value_3_text")}
            </ValueItem>
            <ValueItem
              icon="/images/sustainability.webp"
              size={[395, 461]}
              name={t("value_4_name")}
            >
              {t("value_4_text")}
            </ValueItem>
          </div>

          <div className="relative -mx-3 flex flex-col items-center gap-[70px] lg:grid lg:grid-cols-2 lg:items-start lg:gap-0">
            <Connector />
            <ValueItem
              icon="/images/inclusivity.webp"
              size={[439, 420]}
              name={t("value_5_name")}
            >
              {t("value_5_text")}
            </ValueItem>
            <ValueItem
              icon="/images/legacy.webp"
              size={[409, 420]}
              name={t("value_6_name")}
              last
            >
              {t("value_6_text")}
            </ValueItem>
          </div>
        </Container>
      </section>
    </div>
  );
}
