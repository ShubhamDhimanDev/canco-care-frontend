import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow, Lead, PageTitle } from "@/components/ui/typography";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Partner With Us",
  description:
    "Join a network of businesses and communities making a difference — corporate, non-profit and individual partners are all welcome.",
  alternates: { canonical: "/partner-with-us" },
};

function PartnerBox({
  icon,
  size,
  alt,
  children,
}: {
  icon: string;
  size: [number, number];
  alt: string;
  children: ReactNode;
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
      <div className="text-left [&>p]:m-0 [&>p]:mb-5 [&>p]:text-[16px] [&>p]:leading-[30px] [&>p]:font-medium [&>p:first-child]:text-[18px] [&>p:first-child]:font-bold [&>p:first-child]:text-brand-slate-dark">
        {children}
      </div>
    </div>
  );
}

export default function PartnerWithUsPage() {
  return (
    <div className="pt-[250px] pb-[200px] tablet:pt-[173px] phone:pt-[128px]">
      <Container>
        <div className="mx-auto max-w-[1076px] text-center">
          <PageTitle className="mb-2">PARTNER</PageTitle>
          <Eyebrow className="text-[25px] phone:text-[20px]">WITH US</Eyebrow>
          <Lead className="mt-[50px]">
            At Canco Cares, we believe in the power of collaboration. Our
            partnerships play a crucial role in our mission to create a ripple
            of positive change in our society.
          </Lead>
        </div>

        <div className="mt-[70px] grid grid-cols-1 gap-x-[50px] phone:mt-[37px] gap-y-[37px] md:grid-cols-2">
          <PartnerBox icon="/images/partnerIconOne.webp" size={[439, 420]} alt="A handshake">
            <p>
              By partnering with us, you join a dedicated network of
              businesses and communities working together to make a
              difference.
            </p>
            <p>
              Whether you’re a corporation looking to give back, a non-profit
              organization aligned with our mission, or an individual
              passionate about community service, there are numerous ways to
              partner with us. From financial contributions and in-kind
              donations to volunteering and advocacy, every form of support
              brings us one step closer to our goal.
            </p>
          </PartnerBox>
          <PartnerBox
            icon="/images/partnerIconTwo.webp"
            size={[449, 420]}
            alt="People celebrating together with a flag"
          >
            <p>
              As a partner, you’ll have the opportunity to contribute to our
              projects, participate in our events, and make a tangible impact
              in the communities we serve.
            </p>
            <p>
              But the benefits of partnership go beyond that. It’s about being
              part of a movement, a collective effort to foster compassion,
              inclusivity, and progress in our society.
            </p>
          </PartnerBox>
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
            <Lead>For inquiries, please contact us at</Lead>
            <p className="m-0 mb-[30px] text-[20px] leading-6 font-medium text-[#212529]">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-[32px] leading-8 font-semibold text-brand-slate underline-offset-4 hover:underline phone:text-[26px]"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
            <Lead className="mb-[30px]">
              Together, we can create a future where every individual is
              empowered to thrive and every community is a beacon of hope and
              resilience. Thank you for considering a partnership with Canco
              Cares. We look forward to building a better tomorrow with you.
            </Lead>
          </div>
          <Button href="/contact-us">Contact Canco Cares</Button>
        </div>
      </Container>
    </div>
  );
}
