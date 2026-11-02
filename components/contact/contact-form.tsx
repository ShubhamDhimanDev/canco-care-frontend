"use client";

import Link from "next/link";
import Script from "next/script";
import { useActionState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  submitInquiry,
  type ContactState,
} from "@/app/contact-us/actions";
import type { InquiryTopic } from "@/lib/api/inquiries";
import { cn } from "@/lib/utils";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const FIELD =
  "block w-full rounded-[8px] border-2 border-transparent bg-white px-5 py-[14px] text-[16px] leading-6 font-medium text-ink shadow-none outline-none placeholder:text-ink/60 focus-visible:border-brand-navy aria-[invalid=true]:border-[#b3261e]";
const LABEL = "mb-3 block text-[16px] leading-6 font-semibold text-white";

/** The message under a field. White on its own pill so it stays readable on the slate band. */
function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p
      id={id}
      className="mt-2 mb-0 inline-block rounded-[6px] bg-white px-3 py-1 text-[14px] leading-5 font-semibold text-[#b3261e]"
    >
      {message}
    </p>
  );
}

const LABELS: Record<string, string> = {
  first_name: "First name",
  last_name: "Last name",
  phone: "Phone number",
  email: "Email",
  inquiry_type: "Topic",
  message: "Inquiry",
  consent: "Privacy agreement",
  bot_token: "Verification",
};

/**
 * The inquiry form. It posts through a Server Action, shows every problem in a summary that takes
 * focus plus under each field, and keeps what was typed. Submit is never disabled because the form
 * is "invalid" — only while it is sending.
 */
export function ContactForm({ topics }: { topics: InquiryTopic[] }) {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(
    submitInquiry,
    { status: "idle" },
  );
  const summary = useRef<HTMLDivElement>(null);

  const errors = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : {};
  const errorList = Object.entries(errors);
  const hasProblem = state.status === "error";

  // A new error summary takes focus, so keyboard and screen-reader users land on it.
  useEffect(() => {
    if (hasProblem) {
      summary.current?.focus();
    }
  }, [hasProblem, state]);

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="mx-auto max-w-[720px] rounded-[16px] bg-white px-8 py-10 text-center shadow-card"
      >
        <h2 className="m-0 text-[28px] leading-9 font-bold text-brand-navy">
          Thank you{state.firstName ? `, ${state.firstName}` : ""}.
        </h2>
        <p className="mt-4 mb-0 text-[18px] leading-8 font-medium text-ink">
          We&apos;ve received your message
          {state.reference ? (
            <>
              {" "}
              (reference <strong>{state.reference}</strong>)
            </>
          ) : null}{" "}
          and will reply as soon as we can. A confirmation is on its way to
          your inbox.
        </p>
        <p className="mt-6 mb-0 text-[16px] font-semibold">
          <Link
            href="/stories"
            className="text-brand-slate-dark underline underline-offset-4"
          >
            Read our latest stories
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="mx-auto max-w-[900px]">
      {hasProblem && (
        <div
          ref={summary}
          tabIndex={-1}
          role="alert"
          className="mb-8 rounded-[8px] bg-white px-5 py-4 text-[15px] leading-6 text-[#b3261e] outline-none focus-visible:ring-4 focus-visible:ring-brand-navy"
        >
          <p className="m-0 font-bold">
            {errorList.length > 0
              ? "Your message was not sent. Please check:"
              : (state.message ?? "Your message was not sent.")}
          </p>
          {errorList.length > 0 && (
            <ul className="m-0 mt-1 list-disc pl-5">
              {errorList.map(([field, message]) => (
                <li key={field}>
                  <a
                    href={`#contact-${field}`}
                    className="font-semibold underline underline-offset-2"
                  >
                    {LABELS[field] ?? field}
                  </a>
                  : {message}
                </li>
              ))}
            </ul>
          )}
          {errorList.length > 0 && state.message && (
            <p className="m-0 mt-2">{state.message}</p>
          )}
        </div>
      )}

      <div className="grid gap-x-10 gap-y-7 md:grid-cols-2">
        <div>
          <label htmlFor="contact-first_name" className={LABEL}>
            First Name<span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-first_name"
            name="first_name"
            type="text"
            autoComplete="given-name"
            required
            maxLength={80}
            defaultValue={values.first_name}
            placeholder="Enter Your First Name"
            aria-required="true"
            aria-invalid={errors.first_name ? true : undefined}
            aria-describedby={errors.first_name ? "err-first_name" : undefined}
            className={FIELD}
          />
          <FieldError id="err-first_name" message={errors.first_name} />
        </div>
        <div>
          <label htmlFor="contact-last_name" className={LABEL}>
            Last Name<span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-last_name"
            name="last_name"
            type="text"
            autoComplete="family-name"
            required
            maxLength={80}
            defaultValue={values.last_name}
            placeholder="Enter Your Last Name"
            aria-required="true"
            aria-invalid={errors.last_name ? true : undefined}
            aria-describedby={errors.last_name ? "err-last_name" : undefined}
            className={FIELD}
          />
          <FieldError id="err-last_name" message={errors.last_name} />
        </div>
        <div>
          <label htmlFor="contact-phone" className={LABEL}>
            Phone Number<span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            required
            maxLength={30}
            defaultValue={values.phone}
            placeholder="(403) 555-1234"
            aria-required="true"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "err-phone" : undefined}
            className={FIELD}
          />
          <FieldError id="err-phone" message={errors.phone} />
        </div>
        <div>
          <label htmlFor="contact-email" className={LABEL}>
            Email<span aria-hidden="true">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={190}
            defaultValue={values.email}
            placeholder="Enter Your Email Address"
            aria-required="true"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "err-email" : undefined}
            className={FIELD}
          />
          <FieldError id="err-email" message={errors.email} />
        </div>

        {topics.length > 0 && (
          <div className="md:col-span-2">
            <label htmlFor="contact-inquiry_type" className={LABEL}>
              I&apos;m contacting about<span aria-hidden="true">*</span>
            </label>
            <select
              id="contact-inquiry_type"
              name="inquiry_type"
              required
              defaultValue={values.inquiry_type ?? ""}
              aria-required="true"
              aria-invalid={errors.inquiry_type ? true : undefined}
              aria-describedby={
                errors.inquiry_type ? "err-inquiry_type" : undefined
              }
              className={cn(FIELD, "appearance-auto")}
            >
              <option value="" disabled>
                Choose a topic
              </option>
              {topics.map((topic) => (
                <option key={topic.slug} value={topic.slug}>
                  {topic.name}
                </option>
              ))}
            </select>
            <FieldError id="err-inquiry_type" message={errors.inquiry_type} />
          </div>
        )}

        <div className="md:col-span-2">
          <label htmlFor="contact-message" className={LABEL}>
            Inquiry<span aria-hidden="true">*</span>
          </label>
          {/* Contained in the band (the live site's textarea spills out of it). */}
          <textarea
            id="contact-message"
            name="message"
            rows={9}
            required
            maxLength={5000}
            defaultValue={values.message}
            placeholder="Please provide us with the information about your request."
            aria-required="true"
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? "err-message" : undefined}
            className={cn(FIELD, "min-h-[220px] resize-y")}
          />
          <FieldError id="err-message" message={errors.message} />
        </div>

        {/* A trap for bots: people never see or reach it. */}
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
        >
          <label htmlFor="contact-website">Leave this field empty</label>
          <input
            id="contact-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-start gap-3">
            <input
              id="contact-consent"
              name="consent"
              type="checkbox"
              required
              aria-required="true"
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={errors.consent ? "err-consent" : undefined}
              className="mt-1 size-5 shrink-0 accent-brand-navy"
            />
            <label
              htmlFor="contact-consent"
              className="text-[15px] leading-6 font-medium text-white"
            >
              I agree to the{" "}
              <Link
                href="/terms-and-conditions"
                className="font-semibold underline underline-offset-2"
              >
                privacy terms
              </Link>{" "}
              and that Canco Cares may contact me about this inquiry.
            </label>
          </div>
          <FieldError id="err-consent" message={errors.consent} />
        </div>

        {TURNSTILE_SITE_KEY && (
          <div className="md:col-span-2">
            <div
              id="contact-bot_token"
              className="cf-turnstile"
              data-sitekey={TURNSTILE_SITE_KEY}
            />
            <FieldError id="err-bot_token" message={errors.bot_token} />
            <Script
              src="https://challenges.cloudflare.com/turnstile/v0/api.js"
              strategy="lazyOnload"
            />
          </div>
        )}
      </div>

      <div className="mt-10 text-center">
        <Button
          type="submit"
          variant="white"
          disabled={pending}
          aria-disabled={pending}
        >
          {pending ? "Sending…" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
