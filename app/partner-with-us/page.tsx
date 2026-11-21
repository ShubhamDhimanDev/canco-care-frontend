import type { Metadata } from "next";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow, Lead, PageTitle } from "@/components/ui/typography";
import { getPage, pageText } from "@/lib/api/pages";
import { CONTACT_EMAIL } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPage("partner-with-us");

  return {
    title: pageText(content, "meta_title"),
    description: pageText(content, "meta_description"),
    alternates: { canonical: "/partner-with-us" },
  };
}

function PartnerBox({
  icon,
  size,
  alt,
  html,
}: {
  icon: string;
  size: [number, number];
  alt: string;
  /** Sanitised by the Laravel app when an editor saves the page. */
  html: string;
}) {
  return (
    <div className="h-full rounded-[16px] bg-white p-[50px] text-center shadow-card phone:px-6 phone:py-[30px]">
      <Image
        src={icon}
        alt={alt}
        width={size[0]}
        height={size[1]}
        className="mx-auto mb-10 h-auto w-[140px]"
      />
      <div
        className="text-left [&>p]:m-0 [&>p]:mb-5 [&>p]:text-[16px] [&>p]:leading-[30px] [&>p]:font-medium [&>p:first-child]:text-[18px] [&>p:first-child]:font-bold [&>p:first-child]:text-brand-slate-dark"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

export default async function PartnerWithUsPage() {
  const c = await getPage("partner-with-us");
  const t = (key: string) => pageText(c, key);

  return (
    <div className="pt-[250px] pb-[200px] tablet:pt-[173px] phone:pt-[128px]">
      <Container>
        <div className="mx-auto max-w-[1076px] text-center">
          <PageTitle className="mb-2">{t("title")}</PageTitle>
          <Eyebrow className="text-[25px] phone:text-[20px]">
            {t("eyebrow")}
          </Eyebrow>
          <Lead className="mt-[50px]">{t("lead")}</Lead>
        </div>

        <div className="mt-[70px] grid grid-cols-1 gap-x-[50px] phone:mt-[37px] gap-y-[37px] md:grid-cols-2">
          <PartnerBox
            icon="/images/partnerIconOne.webp"
            size={[439, 420]}
            alt="A handshake"
            html={t("box_1")}
          />
          <PartnerBox
            icon="/images/partnerIconTwo.webp"
            size={[449, 420]}
            alt="People celebrating together with a flag"
            html={t("box_2")}
          />
        </div>

        <div className="pt-[162px] pb-[70px] text-center phone:pt-[40px] phone:pb-[200px]">
          <Image
            src="/images/careLogo.png"
            alt="Canco Cares"
            width={250}
            height={176}
            className="mx-auto mb-[50px] h-auto w-[250px]"
          />
          <div className="mx-auto md:max-w-[calc((100%+24px)*7/12-24px)]">
            <Lead>{t("contact_lead")}</Lead>
            <p className="m-0 mb-[30px] text-[20px] leading-6 font-medium text-[#212529]">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-[32px] leading-8 font-semibold text-brand-slate underline-offset-4 hover:underline phone:text-[26px]"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
            <Lead className="mb-[30px]">{t("closing_lead")}</Lead>
          </div>
          <Button href="/contact-us">{t("button_label")}</Button>
        </div>
      </Container>
    </div>
  );
}
