import type { Metadata } from "next";

import { Container } from "@/components/ui/container";
import { Eyebrow, Lead, PageTitle } from "@/components/ui/typography";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Questions, partnerships or ways to get involved — get in touch with the Canco Cares team.",
  alternates: { canonical: "/contact-us" },
};

// INTERIM: the inquiry form needs the Laravel inquiries endpoint (docs/plan/09-feature-inquiries.md),
// which is not built yet. Until then this page carries the live copy and a plain email address.
export default function ContactUsPage() {
  return (
    <div className="pt-[250px] pb-[70px] tablet:pt-[173px] phone:pt-[128px]">
      <Container>
        <div className="mx-auto text-center md:max-w-[calc((100%+24px)*10/12-24px)]">
          <PageTitle className="mb-2">CONTACT</PageTitle>
          <Eyebrow>CANCO CARES</Eyebrow>
          <Lead className="mt-10">
            We’d love to hear from you! Whether you have a question about our
            projects, want to get involved, or simply want to learn more about
            Canco Cares, our team is here to help. Your feedback and inquiries
            are important to us. They help us understand your needs and
            improve our services. So don’t hesitate to reach out.
          </Lead>
          <h2 className="mt-[39px] mb-0 text-[22px] leading-8 font-semibold text-brand-slate">
            Please email us with your contact information and message.
          </h2>
          <Lead className="mt-2 text-[20px]">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-semibold text-brand-navy underline underline-offset-4"
            >
              {CONTACT_EMAIL}
            </a>
          </Lead>
          <p className="mt-2 mb-0 text-[18px] leading-8 font-medium">
            We’ll do our best to respond as quickly as possible. An online
            contact form is coming soon.
          </p>
        </div>

        <div className="mt-[120px] text-center">
          <p className="m-0 text-[18px] leading-8 font-medium">
            Thank you for your interest in Canco Cares
          </p>
          <p className="mt-5 mb-0 text-[28px] leading-8 font-semibold text-brand-slate phone:leading-[44px]">
            Together we can create a ripple of positive change in our society.
          </p>
        </div>
      </Container>
    </div>
  );
}
