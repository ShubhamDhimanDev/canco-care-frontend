import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/ui/container";
import { Eyebrow, Lead, PageTitle } from "@/components/ui/typography";
import { getInquiryTopics } from "@/lib/api/inquiries";
import { getPage, pageText } from "@/lib/api/pages";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPage("contact-us");

  return {
    title: pageText(content, "meta_title"),
    description: pageText(content, "meta_description"),
    alternates: { canonical: "/contact-us" },
  };
}

export default async function ContactUsPage() {
  const [topics, c] = await Promise.all([
    getInquiryTopics(),
    getPage("contact-us"),
  ]);
  const t = (key: string) => pageText(c, key);

  return (
    <div className="pt-[250px] pb-[70px] tablet:pt-[173px] phone:pt-[128px]">
      <Container>
        <div className="mx-auto text-center md:max-w-[calc((100%+24px)*10/12-24px)]">
          <PageTitle className="mb-2">{t("title")}</PageTitle>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <Lead className="mt-10">{t("lead")}</Lead>
          <h2 className="mt-[39px] mb-0 text-[22px] leading-8 font-semibold text-brand-slate">
            {t("form_heading")}
          </h2>
          <p className="mt-2 mb-0 text-[18px] leading-8 font-medium">
            {t("form_note")}
          </p>
        </div>
      </Container>

      <section
        aria-label="Contact form"
        className="mt-[60px] bg-[url('/images/blueBg.webp')] bg-cover bg-center bg-no-repeat py-[66px] phone:py-[50px]"
      >
        <Container>
          <ContactForm topics={topics} />
        </Container>
      </section>

      <Container>
        <div className="mt-[120px] text-center phone:mt-[80px]">
          <p className="m-0 text-[18px] leading-8 font-medium">{t("thanks")}</p>
          <p className="mt-5 mb-0 text-[28px] leading-8 font-semibold text-brand-slate phone:leading-[44px]">
            {t("closing")}
          </p>
        </div>
      </Container>
    </div>
  );
}
