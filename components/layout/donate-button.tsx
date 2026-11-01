"use client";

import Image from "next/image";
import { useRef } from "react";

import { Button, type ButtonVariant } from "@/components/ui/button";

/**
 * Temporary: online giving is not built yet (the live site shows the same "coming soon" modal).
 * When /donate exists, replace <DonateButton> with a plain <Button href="/donate"> and delete this file.
 *
 * Uses the native <dialog> element, so focus is trapped, Escape closes it and focus returns to the
 * button that opened it — behaviour the live site's modal lacked.
 */
export function DonateButton({
  variant = "primary",
  className,
}: {
  variant?: ButtonVariant;
  className?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button
        variant={variant}
        className={className}
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        Donate
      </Button>

      <dialog
        ref={dialog}
        aria-labelledby="donate-title"
        className="m-auto w-full max-w-[872px] rounded-[16px] bg-white p-0 shadow-card backdrop:bg-white/20 backdrop:backdrop-blur-[10px] tablet:max-w-[80%] phone:max-w-[90%]"
        onClick={(event) => {
          // A click on the backdrop lands on the <dialog> element itself.
          if (event.target === event.currentTarget) {
            dialog.current?.close();
          }
        }}
      >
        <div className="relative flex flex-col items-center gap-10 px-[74px] pt-[63px] pb-[53px] text-center phone:gap-[27px] phone:px-7 phone:py-[38px]">
          <button
            type="button"
            aria-label="Close"
            onClick={() => dialog.current?.close()}
            className="absolute top-5 right-5 grid size-9 place-items-center rounded-full text-brand-slate-dark transition-colors hover:text-brand-orange"
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

          <Image
            src="/images/careLogo.png"
            alt="Canco Cares"
            width={194}
            height={136}
            className="h-auto w-[194px] phone:w-[154px]"
          />
          <h2
            id="donate-title"
            className="m-0 text-[26px] leading-[38px] font-semibold tracking-[1.56px] text-brand-navy phone:text-[20px] phone:leading-8 phone:tracking-[1.2px]"
          >
            THANK YOU FOR YOUR INTEREST IN SUPPORTING CANCO CARES!
          </h2>
          <p className="m-0 text-[18px] leading-7 font-medium text-brand-slate">
            Our donation feature will be available soon.
          </p>
          <p className="m-0 text-[18px] leading-7 font-medium text-ink">
            We appreciate your patience and understanding as we finalize this
            important part of our website. Your support is invaluable and
            helps us continue making a positive impact.
          </p>
          <p className="m-0 text-[18px] leading-7 font-medium text-brand-slate">
            Thank you for caring!
          </p>
        </div>
      </dialog>
    </>
  );
}
