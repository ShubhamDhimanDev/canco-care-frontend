import Image from "next/image";
import Link from "next/link";

import { MobileMenu } from "@/components/layout/mobile-menu";
import { SocialLinks } from "@/components/layout/social-links";
import { MAIN_NAV } from "@/lib/site";

/**
 * Sits on top of the page (the page content starts at the very top and pads itself down),
 * exactly like the live site's header: logo left, four links and social icons right,
 * and a hamburger menu below 992 px.
 */
export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 pt-[42px] tablet:pt-[33px]">
      <div className="mx-auto flex w-full items-center justify-between px-3 sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px] tablet:max-w-none tablet:px-5">
        <Link href="/" aria-label="Canco Cares — home">
          <Image
            src="/images/careLogo.png"
            alt="Canco Cares"
            width={196}
            height={138}
            priority
            className="h-auto w-[196px] tablet:w-[100px]"
          />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="m-0 flex list-none items-center justify-end gap-[60px] p-0">
            {MAIN_NAV.map((item) => (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="inline-block text-[18px] leading-[27px] font-semibold text-brand-slate"
                >
                  {item.label}
                </Link>
                {/* The live site reveals a small heart under the hovered link. */}
                <Image
                  src="/images/bigHeartIcon.webp"
                  alt=""
                  width={22}
                  height={20}
                  aria-hidden="true"
                  className="pointer-events-none absolute top-full left-1/2 mt-[5px] h-5 w-[22px] -translate-x-1/2 scale-0 opacity-0 transition duration-200 ease-in-out group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:scale-100 group-hover:opacity-100"
                />
              </li>
            ))}
            <li>
              <SocialLinks tone="header" className="gap-[30px]" />
            </li>
          </ul>
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
}
