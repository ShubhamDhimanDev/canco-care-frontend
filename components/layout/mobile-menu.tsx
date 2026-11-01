"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { DonateButton } from "@/components/layout/donate-button";
import { SocialLinks } from "@/components/layout/social-links";
import { Button } from "@/components/ui/button";
import { MAIN_NAV } from "@/lib/site";

/**
 * Hamburger + full-height menu panel for screens below 992 px. Built on the native <dialog>
 * element: focus is trapped, Escape closes it, and focus goes back to the hamburger.
 */
export function MobileMenu() {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Open menu"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
        className="grid size-11 place-items-center"
      >
        <svg
          width="21.612"
          height="19.011"
          viewBox="0 0 21.612 19.011"
          aria-hidden="true"
          className="fill-brand-slate"
        >
          <g transform="translate(-4.5 -10.125)">
            <path d="M25.212 11.926H5.4a.9.9 0 0 1-.9-.9.9.9 0 0 1 .9-.9h19.812a.9.9 0 0 1 .9.9.9.9 0 0 1-.9.9Z" />
            <path
              d="M25.212 18.676H5.4a.9.9 0 0 1-.9-.9.9.9 0 0 1 .9-.9h19.812a.9.9 0 0 1 .9.9.9.9 0 0 1-.9.9Z"
              transform="translate(0 1.855)"
            />
            <path
              d="M25.212 25.426H5.4a.9.9 0 0 1-.9-.9.9.9 0 0 1 .9-.9h19.812a.9.9 0 0 1 .9.9.9.9 0 0 1-.9.9Z"
              transform="translate(0 3.71)"
            />
          </g>
        </svg>
      </button>

      <dialog
        ref={dialog}
        aria-label="Menu"
        className="m-0 ml-auto h-dvh max-h-none w-full max-w-none border-l-2 border-[#3b3939] bg-brand-slate p-0 shadow-[-5px_0_5px_0_rgba(0,0,0,0.1)] backdrop:bg-transparent sm:w-[420px]"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            close();
          }
        }}
      >
        <div className="relative flex min-h-full flex-col items-center gap-10 px-6 pt-[60px] pb-10">
          <button
            type="button"
            aria-label="Close menu"
            onClick={close}
            className="absolute top-5 right-5 grid size-11 place-items-center text-white"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>

          <Link href="/" onClick={close} aria-label="Canco Cares home">
            <Image
              src="/images/careWhiteLogo.webp"
              alt="Canco Cares"
              width={167}
              height={125}
              className="h-auto w-[167px]"
            />
          </Link>

          <div className="flex flex-col items-center gap-10">
            <Button variant="outline" href="/partner-with-us" onClick={close}>
              Partner with us
            </Button>
            <DonateButton variant="white" className="w-full max-w-[172px]" />
          </div>

          <nav aria-label="Main" className="w-full">
            <ul className="m-0 flex w-full list-none flex-col items-center gap-[46px] p-0">
              {MAIN_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="block text-[18px] font-semibold text-white/50 capitalize transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <SocialLinks tone="footer" className="gap-5" />
        </div>
      </dialog>
    </div>
  );
}
