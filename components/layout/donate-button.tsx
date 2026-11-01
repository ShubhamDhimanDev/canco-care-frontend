"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { DonationForm } from "@/components/donate/donation-form";
import { Button, type ButtonVariant } from "@/components/ui/button";
import { loadDonationOptions } from "@/lib/actions/donate";
import type { DonationOptions } from "@/lib/donate-types";

type Loaded =
  | { state: "idle" }
  | { state: "loading" }
  | { state: "ready"; options: DonationOptions }
  // Giving is closed (switched off, or no payment provider yet), or the server could not be reached.
  | { state: "closed" };

/**
 * The Donate button and its popup. The popup loads what it needs (amounts, events, whether giving is
 * open) when it is opened, so every Donate button on every page shows the current state.
 *
 * Uses the native <dialog> element, so focus is trapped, Escape closes it and focus returns to the
 * button that opened it — behaviour the live site's modal lacked.
 */
export function DonateButton({
  variant = "primary",
  className,
  label = "Donate",
}: {
  variant?: ButtonVariant;
  className?: string;
  label?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [loaded, setLoaded] = useState<Loaded>({ state: "idle" });
  // Bumped on every open so a finished donation never reappears when the popup is opened again.
  const [session, setSession] = useState(0);

  async function open() {
    setSession((value) => value + 1);
    setLoaded({ state: "loading" });
    dialog.current?.showModal();

    const options = await loadDonationOptions();

    setLoaded(
      options && options.enabled
        ? { state: "ready", options }
        : { state: "closed" },
    );
  }

  const close = () => dialog.current?.close();

  return (
    <>
      <Button
        variant={variant}
        className={className}
        aria-haspopup="dialog"
        onClick={() => void open()}
      >
        {label}
      </Button>

      <dialog
        ref={dialog}
        aria-labelledby="donate-title"
        className="m-auto max-h-[92vh] w-full max-w-[872px] overflow-y-auto rounded-[16px] bg-white p-0 shadow-card backdrop:bg-white/20 backdrop:backdrop-blur-[10px] tablet:max-w-[80%] phone:max-w-[94%]"
        onClick={(event) => {
          // A click on the backdrop lands on the <dialog> element itself.
          if (event.target === event.currentTarget) {
            close();
          }
        }}
      >
        <div className="relative px-[74px] pt-[48px] pb-[48px] tablet:px-10 phone:px-5 phone:py-[38px]">
          <button
            type="button"
            aria-label="Close"
            onClick={close}
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
            className="mx-auto mb-6 h-auto w-[130px] phone:w-[110px]"
          />

          {loaded.state === "ready" && (
            <DonationForm key={session} options={loaded.options} onClose={close} />
          )}

          {loaded.state === "loading" && (
            <div aria-live="polite" className="py-10 text-center">
              <h2
                id="donate-title"
                className="m-0 text-[22px] leading-8 font-semibold text-brand-navy"
              >
                One moment…
              </h2>
            </div>
          )}

          {loaded.state === "closed" && (
            <div className="flex flex-col items-center gap-8 text-center phone:gap-[27px]">
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
                We appreciate your patience and understanding as we finalize
                this important part of our website. Your support is invaluable
                and helps us continue making a positive impact.
              </p>
              <p className="m-0 text-[18px] leading-7 font-medium text-brand-slate">
                Thank you for caring!
              </p>
            </div>
          )}

          {loaded.state === "idle" && (
            // Never visible (the dialog only opens through the button), but the dialog needs its label.
            <h2 id="donate-title" className="sr-only">
              Donate
            </h2>
          )}
        </div>
      </dialog>
    </>
  );
}
