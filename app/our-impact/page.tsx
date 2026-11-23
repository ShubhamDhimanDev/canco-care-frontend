import type { Metadata } from "next";
import Image from "next/image";

import { CharityBand } from "@/components/sections/charity-band";
import { LatestStories } from "@/components/stories/latest-stories";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow, Lead, PageTitle } from "@/components/ui/typography";
import { getPage, pageImage, pageText } from "@/lib/api/pages";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPage("our-impact");

  return {
    title: pageText(content, "meta_title"),
    description: pageText(content, "meta_description"),
    alternates: { canonical: "/our-impact" },
  };
}

export default async function OurImpactPage() {
  const c = await getPage("our-impact");
  const t = (key: string) => pageText(c, key);
  const photo = pageImage(c, "photo");

  return (
    <>
      <section className="pt-[250px] pb-[54px] tablet:pt-[173px] phone:pt-[128px]">
        <Container>
          <div className="mx-auto text-center md:max-w-[calc((100%+24px)*10/12-24px)]">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <PageTitle>{t("title")}</PageTitle>
            <Lead className="mt-[27px]">{t("lead")}</Lead>
          </div>
        </Container>
      </section>

      <CharityBand />

      <section className="pt-[230px] pb-[260px] phone:pt-[160px] phone:pb-[220px]">
        <Container>
          <div className="-mx-3 grid grid-cols-1 items-start gap-y-[30px] lg:grid-cols-2">
            <div className="pr-[30px] pl-3 md:mx-auto md:w-2/3 lg:mx-0 lg:w-auto">
              <Image
                src={photo?.url ?? "/images/impactPhoto.webp"}
                alt={
                  photo?.alt ??
                  "Canco team members presenting a cheque to the KGH Foundation"
                }
                width={photo?.width ?? 640}
                height={photo?.height ?? 480}
                sizes="(min-width: 992px) 600px, 100vw"
                className="h-auto w-full rounded-[20px]"
              />
            </div>
            <div
              className="pl-[45px] pr-3 tablet:px-0 phone:mt-5 phone:pl-3 [&>p]:m-0 [&>p]:mb-4 [&>p]:text-[16px] [&>p]:leading-8 [&>p]:font-medium [&>p:nth-child(odd)]:text-[18px] [&>p:nth-child(odd)]:font-bold [&>p:nth-child(odd)]:text-brand-slate-dark"
              // Sanitised by the Laravel app when an editor saves the page.
              dangerouslySetInnerHTML={{ __html: t("body") }}
            />
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
            <Lead>{t("closing_lead")}</Lead>
            <h2 className="mt-10 mb-0 text-[28px] leading-[33.6px] font-bold tracking-[1px] text-brand-navy phone:text-[30px] phone:leading-12">
              {t("closing_heading")}
            </h2>
          </div>
        </Container>
      </section>
    </>
  );
}
