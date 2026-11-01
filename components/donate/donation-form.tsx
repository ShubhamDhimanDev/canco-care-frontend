"use client";

import Link from "next/link";
import Script from "next/script";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { confirmDonation, startDonation } from "@/lib/actions/donate";
import {
  FAKE_APPROVE,
  FAKE_DECLINE,
  type DonationInput,
  type DonationOptions,
} from "@/lib/donate-types";
import { cn } from "@/lib/utils";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const PROVINCES = [
  ["AB", "Alberta"],
  ["BC", "British Columbia"],
  ["MB", "Manitoba"],
  ["NB", "New Brunswick"],
  ["NL", "Newfoundland and Labrador"],
  ["NS", "Nova Scotia"],
  ["NT", "Northwest Territories"],
  ["NU", "Nunavut"],
  ["ON", "Ontario"],
  ["PE", "Prince Edward Island"],
  ["QC", "Quebec"],
  ["SK", "Saskatchewan"],
  ["YT", "Yukon"],
] as const;

const FIELD =
  "block w-full rounded-[8px] border-2 border-brand-slate/30 bg-white px-4 py-[11px] text-[16px] leading-6 font-medium text-ink outline-none placeholder:text-ink/50 focus-visible:border-brand-navy aria-[invalid=true]:border-[#b3261e]";
const LABEL = "mb-2 block text-[14px] leading-5 font-semibold text-brand-slate-dark";

const LABELS: Record<string, string> = {
  amount_cents: "Amount",
  event: "Event",
  first_name: "First name",
  last_name: "Last name",
  email: "Email",
  phone: "Phone",
  address_line1: "Street address",
  address_line2: "Suite or unit",
  city: "City",
  province: "Province",
  postal_code: "Postal code",
  consent: "Privacy agreement",
  bot_token: "Verification",
  idempotency_key: "Request",
};

function money(cents: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(cents / 100);
}

/** A fresh id per attempt; the server answers a repeated id with the same donation, never a second one. */
function newKey(): string {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p
      id={id}
      className="mt-1.5 mb-0 text-[13px] leading-5 font-semibold text-[#b3261e]"
    >
      {message}
    </p>
  ) : null;
}

type Values = Record<string, string>;

type Step =
  | { name: "form" }
  | { name: "pay"; reference: string; amount: number; testMode: boolean }
  | {
      name: "done";
      ok: boolean;
      amount: number;
      receipt: string | null;
      reason: string | null;
      testMode: boolean;
    };

/**
 * The donation form shown in the Donate popup: amount, an optional event, the donor's details (a
 * Canadian address, for the tax receipt), then payment. Every problem is listed in a summary that takes
 * focus and repeated under its field. The amount that is charged is the one the server stored when the
 * donation was created, whatever this page later claims.
 */
export function DonationForm({
  options,
  onClose,
}: {
  options: DonationOptions;
  onClose: () => void;
}) {
  const { presets_cents: presets, min_cents: minimum } = options;
  const [step, setStep] = useState<Step>({ name: "form" });
  const [selected, setSelected] = useState<number | "other">(
    presets.length > 1 ? presets[1] : (presets[0] ?? "other"),
  );
  const [other, setOther] = useState("");
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [problem, setProblem] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const idempotency = useRef(newKey());
  const summary = useRef<HTMLDivElement>(null);
  // Kept for the thank-you message (the form fields are gone by then).
  const [donor, setDonor] = useState({ first: "", email: "" });

  const showProblems = (
    next: Record<string, string>,
    message: string | null = null,
  ) => {
    setErrors(next);
    setProblem(message);
    // After the summary renders, move focus to it so keyboard and screen-reader users land there.
    requestAnimationFrame(() => summary.current?.focus());
  };

  const amountCents = (): number | null => {
    if (selected !== "other") {
      return selected;
    }

    const dollars = Number.parseFloat(other.replace(/[$,\s]/g, ""));

    return Number.isFinite(dollars) && dollars > 0
      ? Math.round(dollars * 100)
      : null;
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const text = (name: string) => String(data.get(name) ?? "").trim();
    const entered: Values = Object.fromEntries(
      [
        "event",
        "first_name",
        "last_name",
        "email",
        "phone",
        "address_line1",
        "address_line2",
        "city",
        "province",
        "postal_code",
      ].map((name) => [name, text(name)]),
    );
    setValues(entered);

    const cents = amountCents();
    const local: Record<string, string> = {};

    if (cents === null) {
      local.amount_cents = "Enter the amount you would like to give.";
    } else if (cents < minimum) {
      local.amount_cents = `The smallest gift is ${money(minimum)}.`;
    } else if (cents > options.max_cents) {
      local.amount_cents = "For gifts over $10,000 please contact us.";
    }

    if (Object.keys(local).length > 0 || cents === null) {
      showProblems(local);

      return;
    }

    const input: DonationInput = {
      amount_cents: cents,
      event: entered.event,
      first_name: entered.first_name,
      last_name: entered.last_name,
      email: entered.email,
      phone: entered.phone,
      address_line1: entered.address_line1,
      address_line2: entered.address_line2,
      city: entered.city,
      province: entered.province,
      postal_code: entered.postal_code,
      consent: data.get("consent") === "on",
      idempotency_key: idempotency.current,
      bot_token: text("cf-turnstile-response") || undefined,
    };

    setBusy(true);
    setErrors({});
    setProblem(null);

    const result = await startDonation(input);

    setBusy(false);

    if (!result.ok) {
      showProblems(result.errors, result.message ?? null);

      return;
    }

    setDonor({ first: entered.first_name, email: entered.email });
    setStep({
      name: "pay",
      reference: result.reference,
      amount: result.amount_cents,
      testMode: result.test_mode,
    });
  }

  async function pay(token: string) {
    if (step.name !== "pay") {
      return;
    }

    setBusy(true);
    setProblem(null);

    const result = await confirmDonation(step.reference, token);

    setBusy(false);

    if (!result.ok) {
      setProblem(result.message);

      return;
    }

    if (result.status === "failed") {
      // A new attempt needs a new key, or the server would hand back this failed donation.
      idempotency.current = newKey();
    }

    setStep({
      name: "done",
      ok: result.status === "succeeded",
      amount: result.amount_cents,
      receipt: result.receipt_number,
      reason: result.failure_reason,
      testMode: step.testMode,
    });
  }

  if (step.name === "done") {
    return (
      <div role="status" className="text-center">
        <h2
          id="donate-title"
          className="m-0 text-[26px] leading-[38px] font-semibold text-brand-navy"
        >
          {step.ok
            ? `Thank you${donor.first ? `, ${donor.first}` : ""}!`
            : "Your donation did not go through"}
        </h2>
        {step.ok ? (
          <>
            <p className="mt-4 mb-0 text-[18px] leading-8 font-medium text-ink">
              Your gift of <strong>{money(step.amount)}</strong> was received.
              {step.receipt && (
                <>
                  {" "}
                  Your tax receipt <strong>#{step.receipt}</strong> is on its
                  way to {donor.email}.
                </>
              )}
            </p>
            {step.testMode && (
              <p className="mt-3 mb-0 text-[14px] font-semibold text-[#8a2a0c]">
                This was a test: no real payment was taken and the receipt is
                marked “not valid for tax purposes”.
              </p>
            )}
            <p className="mt-4 mb-0 text-[18px] leading-8 font-semibold text-brand-slate">
              Together we can create a ripple of positive change.
            </p>
            <div className="mt-8">
              <Button type="button" onClick={onClose}>
                Close
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-4 mb-0 text-[18px] leading-8 font-medium text-ink">
              {step.reason ?? "The payment could not be completed."} You have
              not been charged.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button type="button" onClick={() => setStep({ name: "form" })}>
                Try again
              </Button>
              <Button type="button" variant="outline" className="border-brand-slate text-brand-slate hover:bg-brand-slate" onClick={onClose}>
                Close
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }

  if (step.name === "pay") {
    return (
      <div>
        <h2
          id="donate-title"
          className="m-0 text-center text-[26px] leading-[38px] font-semibold text-brand-navy"
        >
          Payment
        </h2>
        <p className="mt-3 mb-0 text-center text-[18px] leading-8 font-medium text-ink">
          Your gift: <strong>{money(step.amount)}</strong>
        </p>

        {problem && (
          <p
            role="alert"
            className="mt-5 mb-0 rounded-[8px] bg-[#fdecea] px-4 py-3 text-[15px] leading-6 font-semibold text-[#b3261e]"
          >
            {problem}
          </p>
        )}

        {step.testMode ? (
          <div className="mt-6 rounded-[12px] border-2 border-dashed border-brand-orange p-5 text-center">
            <p className="m-0 text-[15px] leading-6 font-bold text-[#8a2a0c]">
              Test mode — no real payment is taken.
            </p>
            <p className="mt-1 mb-0 text-[14px] leading-6 text-ink">
              Card fields appear here once the payment provider is connected.
              Choose what the test should do:
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <Button
                type="button"
                disabled={busy}
                onClick={() => void pay(FAKE_APPROVE)}
              >
                {busy ? "Working…" : "Approve test payment"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                className="border-brand-slate text-brand-slate hover:bg-brand-slate"
                onClick={() => void pay(FAKE_DECLINE)}
              >
                Simulate a declined card
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-6 mb-0 text-center text-[16px] leading-7 font-medium text-ink">
            Secure card entry is not available yet. Please try again soon.
          </p>
        )}
      </div>
    );
  }

  const errorEntries = Object.entries(errors);
  const err = (name: string) => errors[name];

  return (
    <form onSubmit={onSubmit} noValidate>
      <h2
        id="donate-title"
        className="m-0 text-center text-[26px] leading-[38px] font-semibold tracking-[1.56px] text-brand-navy phone:text-[22px] phone:leading-8"
      >
        MAKE A DONATION
      </h2>
      <p className="mt-2 mb-0 text-center text-[16px] leading-7 font-medium text-brand-slate">
        Canco Cares Foundation is a registered charity. You will receive an
        official tax receipt by email.
      </p>

      {options.test_mode && (
        <p className="mt-4 mb-0 rounded-[8px] bg-[#fff4e5] px-4 py-2 text-center text-[14px] font-bold text-[#8a2a0c]">
          Test mode: no real payment is taken.
        </p>
      )}

      {(errorEntries.length > 0 || problem) && (
        <div
          ref={summary}
          tabIndex={-1}
          role="alert"
          className="mt-5 rounded-[8px] bg-[#fdecea] px-4 py-3 text-[14px] leading-6 text-[#b3261e] outline-none focus-visible:ring-4 focus-visible:ring-brand-navy"
        >
          <p className="m-0 font-bold">
            {errorEntries.length > 0
              ? "Please check:"
              : (problem ?? "Something went wrong.")}
          </p>
          {errorEntries.length > 0 && (
            <ul className="m-0 mt-1 list-disc pl-5">
              {errorEntries.map(([field, message]) => (
                <li key={field}>
                  <a
                    href={`#donate-${field}`}
                    className="font-semibold underline underline-offset-2"
                  >
                    {LABELS[field] ?? field}
                  </a>
                  : {message}
                </li>
              ))}
            </ul>
          )}
          {errorEntries.length > 0 && problem && (
            <p className="m-0 mt-2">{problem}</p>
          )}
        </div>
      )}

      <fieldset className="mt-6 border-0 p-0" id="donate-amount_cents">
        <legend className="mb-3 p-0 text-[16px] font-bold text-brand-navy">
          Amount (CAD)
        </legend>
        <div className="flex flex-wrap gap-3">
          {presets.map((cents) => (
            <label
              key={cents}
              className={cn(
                "cursor-pointer rounded-[10px] border-2 px-5 py-2.5 text-[16px] font-semibold transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-navy/40",
                selected === cents
                  ? "border-brand-navy bg-brand-navy text-white"
                  : "border-brand-slate/40 text-brand-slate-dark hover:border-brand-navy",
              )}
            >
              <input
                type="radio"
                name="amount"
                value={cents}
                checked={selected === cents}
                onChange={() => setSelected(cents)}
                className="sr-only"
              />
              {money(cents).replace(/\.00$/, "")}
            </label>
          ))}
          <label
            className={cn(
              "cursor-pointer rounded-[10px] border-2 px-5 py-2.5 text-[16px] font-semibold transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-navy/40",
              selected === "other"
                ? "border-brand-navy bg-brand-navy text-white"
                : "border-brand-slate/40 text-brand-slate-dark hover:border-brand-navy",
            )}
          >
            <input
              type="radio"
              name="amount"
              value="other"
              checked={selected === "other"}
              onChange={() => setSelected("other")}
              className="sr-only"
            />
            Other
          </label>
        </div>
        {selected === "other" && (
          <div className="mt-3 max-w-[220px]">
            <label htmlFor="donate-other" className={LABEL}>
              Amount in dollars
            </label>
            <input
              id="donate-other"
              inputMode="decimal"
              autoComplete="off"
              value={other}
              onChange={(e) => setOther(e.target.value)}
              placeholder="e.g. 75"
              aria-invalid={err("amount_cents") ? true : undefined}
              aria-describedby={err("amount_cents") ? "err-amount_cents" : undefined}
              className={FIELD}
            />
          </div>
        )}
        <FieldError id="err-amount_cents" message={err("amount_cents")} />
      </fieldset>

      {options.events.length > 0 && (
        <div className="mt-6">
          <label htmlFor="donate-event" className={LABEL}>
            Support an event
          </label>
          <select
            id="donate-event"
            name="event"
            defaultValue={values.event ?? ""}
            aria-invalid={err("event") ? true : undefined}
            aria-describedby={err("event") ? "err-event" : undefined}
            className={cn(FIELD, "appearance-auto")}
          >
            <option value="">General donation</option>
            {options.events.map((event) => (
              <option key={event.slug} value={event.slug}>
                {event.title}
              </option>
            ))}
          </select>
          <FieldError id="err-event" message={err("event")} />
        </div>
      )}

      <div className="mt-6 grid gap-x-5 gap-y-5 sm:grid-cols-2">
        <div>
          <label htmlFor="donate-first_name" className={LABEL}>
            First name<span aria-hidden="true">*</span>
          </label>
          <input
            id="donate-first_name"
            name="first_name"
            autoComplete="given-name"
            required
            maxLength={80}
            defaultValue={values.first_name}
            aria-required="true"
            aria-invalid={err("first_name") ? true : undefined}
            aria-describedby={err("first_name") ? "err-first_name" : undefined}
            className={FIELD}
          />
          <FieldError id="err-first_name" message={err("first_name")} />
        </div>
        <div>
          <label htmlFor="donate-last_name" className={LABEL}>
            Last name<span aria-hidden="true">*</span>
          </label>
          <input
            id="donate-last_name"
            name="last_name"
            autoComplete="family-name"
            required
            maxLength={80}
            defaultValue={values.last_name}
            aria-required="true"
            aria-invalid={err("last_name") ? true : undefined}
            aria-describedby={err("last_name") ? "err-last_name" : undefined}
            className={FIELD}
          />
          <FieldError id="err-last_name" message={err("last_name")} />
        </div>
        <div>
          <label htmlFor="donate-email" className={LABEL}>
            Email<span aria-hidden="true">*</span>
          </label>
          <input
            id="donate-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={190}
            defaultValue={values.email}
            aria-required="true"
            aria-invalid={err("email") ? true : undefined}
            aria-describedby={err("email") ? "err-email" : undefined}
            className={FIELD}
          />
          <FieldError id="err-email" message={err("email")} />
        </div>
        <div>
          <label htmlFor="donate-phone" className={LABEL}>
            Phone (optional)
          </label>
          <input
            id="donate-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            maxLength={30}
            defaultValue={values.phone}
            aria-invalid={err("phone") ? true : undefined}
            aria-describedby={err("phone") ? "err-phone" : undefined}
            className={FIELD}
          />
          <FieldError id="err-phone" message={err("phone")} />
        </div>
      </div>

      <fieldset className="mt-6 border-0 p-0">
        <legend className="mb-1 p-0 text-[16px] font-bold text-brand-navy">
          Address
        </legend>
        <p className="mt-0 mb-3 text-[13px] leading-5 text-ink">
          Your Canadian address is printed on your tax receipt.
        </p>
        <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="donate-address_line1" className={LABEL}>
              Street address<span aria-hidden="true">*</span>
            </label>
            <input
              id="donate-address_line1"
              name="address_line1"
              autoComplete="address-line1"
              required
              maxLength={255}
              defaultValue={values.address_line1}
              aria-required="true"
              aria-invalid={err("address_line1") ? true : undefined}
              aria-describedby={err("address_line1") ? "err-address_line1" : undefined}
              className={FIELD}
            />
            <FieldError id="err-address_line1" message={err("address_line1")} />
          </div>
          <div>
            <label htmlFor="donate-address_line2" className={LABEL}>
              Suite or unit (optional)
            </label>
            <input
              id="donate-address_line2"
              name="address_line2"
              autoComplete="address-line2"
              maxLength={255}
              defaultValue={values.address_line2}
              className={FIELD}
            />
          </div>
          <div>
            <label htmlFor="donate-city" className={LABEL}>
              City<span aria-hidden="true">*</span>
            </label>
            <input
              id="donate-city"
              name="city"
              autoComplete="address-level2"
              required
              maxLength={100}
              defaultValue={values.city}
              aria-required="true"
              aria-invalid={err("city") ? true : undefined}
              aria-describedby={err("city") ? "err-city" : undefined}
              className={FIELD}
            />
            <FieldError id="err-city" message={err("city")} />
          </div>
          <div>
            <label htmlFor="donate-province" className={LABEL}>
              Province<span aria-hidden="true">*</span>
            </label>
            <select
              id="donate-province"
              name="province"
              autoComplete="address-level1"
              required
              defaultValue={values.province ?? ""}
              aria-required="true"
              aria-invalid={err("province") ? true : undefined}
              aria-describedby={err("province") ? "err-province" : undefined}
              className={cn(FIELD, "appearance-auto")}
            >
              <option value="" disabled>
                Choose…
              </option>
              {PROVINCES.map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
            <FieldError id="err-province" message={err("province")} />
          </div>
          <div>
            <label htmlFor="donate-postal_code" className={LABEL}>
              Postal code<span aria-hidden="true">*</span>
            </label>
            <input
              id="donate-postal_code"
              name="postal_code"
              autoComplete="postal-code"
              required
              maxLength={10}
              placeholder="V1X 2A1"
              defaultValue={values.postal_code}
              aria-required="true"
              aria-invalid={err("postal_code") ? true : undefined}
              aria-describedby={err("postal_code") ? "err-postal_code" : undefined}
              className={FIELD}
            />
            <FieldError id="err-postal_code" message={err("postal_code")} />
          </div>
        </div>
      </fieldset>

      <div className="mt-6">
        <div className="flex items-start gap-3">
          <input
            id="donate-consent"
            name="consent"
            type="checkbox"
            required
            aria-required="true"
            aria-invalid={err("consent") ? true : undefined}
            aria-describedby={err("consent") ? "err-consent" : undefined}
            className="mt-1 size-5 shrink-0 accent-brand-navy"
          />
          <label
            htmlFor="donate-consent"
            className="text-[14px] leading-6 font-medium text-ink"
          >
            I agree to the{" "}
            <Link
              href="/terms-and-conditions"
              target="_blank"
              className="font-semibold text-brand-slate-dark underline underline-offset-2"
            >
              privacy terms
            </Link>{" "}
            and that Canco Cares may email my receipt to the address above.
          </label>
        </div>
        <FieldError id="err-consent" message={err("consent")} />
      </div>

      {TURNSTILE_SITE_KEY && (
        <div className="mt-5">
          <div
            id="donate-bot_token"
            className="cf-turnstile"
            data-sitekey={TURNSTILE_SITE_KEY}
          />
          <FieldError id="err-bot_token" message={err("bot_token")} />
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            strategy="lazyOnload"
          />
        </div>
      )}

      <div className="mt-8 text-center">
        <Button type="submit" disabled={busy} aria-disabled={busy}>
          {busy ? "One moment…" : "Continue to payment"}
        </Button>
      </div>
    </form>
  );
}
