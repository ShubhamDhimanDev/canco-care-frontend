import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";

import { DonateButton } from "@/components/layout/donate-button";
import { SocialLinks } from "@/components/layout/social-links";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  FOOTER_IMPACT,
  FOOTER_SITE_MAP,
  FOOTER_TAGLINE,
  FOOTER_TAGLINE_BOLD,
  type NavLink,
} from "@/lib/site";

/** The copyright year. Cached because Cache Components does not allow reading the clock during render. */
async function currentYear(): Promise<number> {
  "use cache";
  cacheLife("days");

  return new Date().getFullYear();
}

const linkClass =
  "text-[18px] font-semibold text-white/50 transition-colors hover:text-white phone:inline-block phone:leading-[27px] phone:capitalize";

function FooterLinks({ links }: { links: NavLink[] }) {
  return (
    <>
      {links.map((link) => (
        <li key={`${link.href}-${link.label}`} className="w-full phone:text-center">
          <Link href={link.href} className={linkClass}>
            {link.label}
          </Link>
        </li>
      ))}
    </>
  );
}

/**
 * One footer for every screen size. Above 600 px it is three columns; at 600 px and below the
 * column wrappers disappear (`display: contents`) and CSS `order` stacks the pieces in the phone
 * order — so there is a single set of links in the page, unlike the legacy site's two footers.
 */
export async function SiteFooter() {
  const year = await currentYear();

  return (
    <footer className="relative -mt-[227px] min-h-[610px] bg-[url('/images/footerBg.webp')] bg-cover bg-center bg-no-repeat pt-[254px] pb-[42px] tablet:-mt-[407px] tablet:pt-[447px] phone:-mt-[145px] phone:min-h-0 phone:bg-[url('/images/mobileFooterBg.webp')] phone:bg-top phone:pt-[186px] phone:pb-[33px]">
      <Container>
        <div className="grid grid-cols-12 items-start gap-x-6 tablet:gap-y-[50px] phone:flex phone:flex-col phone:items-center phone:gap-10">
          {/* Brand */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 phone:contents">
            <Image
              src="/images/careWhiteLogo.webp"
              alt="Canco Cares"
              width={167}
              height={125}
              className="mb-[30px] h-auto w-[167px] phone:order-1 phone:mb-0"
            />
            <p className="m-0 text-[14px] leading-8 font-normal text-white phone:order-3 phone:text-center phone:leading-7 phone:font-medium">
              {FOOTER_TAGLINE}{" "}
              <span className="font-semibold phone:font-bold">{FOOTER_TAGLINE_BOLD}</span>
            </p>
            <p className="mt-4 mb-0 text-[12px] leading-8 font-medium text-white phone:order-6 phone:mt-4 phone:text-center phone:leading-8">
              © Canco Cares {year}. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <nav
            aria-label="Footer"
            className="col-span-12 flex items-start justify-between gap-5 md:col-span-6 lg:col-span-4 phone:order-4 phone:mt-4 phone:w-full phone:flex-col phone:items-center phone:gap-[46px]"
          >
            <ul className="m-0 flex w-full list-none flex-col items-center gap-[26px] p-0 phone:gap-[46px]">
              <li className="mt-5 w-full phone:hidden">
                <span className="inline-block text-[18px] leading-[27px] font-semibold text-white">
                  Site Map
                </span>
              </li>
              <FooterLinks links={FOOTER_SITE_MAP.slice(0, 2)} />
              {/* On a phone the live footer lists "Our Impact" as an ordinary link. */}
              <li className="hidden w-full phone:list-item phone:text-center">
                <Link href="/our-impact" className={linkClass}>
                  Our Impact
                </Link>
              </li>
              <FooterLinks links={FOOTER_SITE_MAP.slice(2)} />
            </ul>
            <ul className="m-0 flex w-full list-none flex-col items-center gap-[26px] p-0 phone:gap-[46px]">
              <li className="mt-5 w-full phone:hidden">
                <Link
                  href="/our-impact"
                  className="inline-block text-[18px] leading-[27px] font-semibold text-white"
                >
                  Our Impact
                </Link>
              </li>
              <FooterLinks links={FOOTER_IMPACT} />
            </ul>
          </nav>

          {/* Social + actions */}
          <div className="col-span-12 flex flex-col items-center gap-[44px] md:col-span-11 lg:col-span-3 lg:pt-[54px] phone:contents">
            <SocialLinks
              tone="footer"
              className="gap-5 phone:order-5 phone:mt-1.5 phone:gap-[35px]"
              iconClassName="phone:size-[42px]"
            />
            <div className="flex flex-col items-center gap-[44px] phone:order-2 phone:gap-10">
              <Button variant="outline" href="/partner-with-us">
                Partner with us
              </Button>
              <DonateButton variant="white" className="phone:w-full phone:max-w-[172px]" />
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
