"use server";

import { headers } from "next/headers";

import { env } from "@/lib/env";
import { CONTACT_EMAIL } from "@/lib/site";
import type {
  ConfirmDonationResult,
  DonationInput,
  DonationOptions,
  StartDonationResult,
} from "@/lib/donate-types";

// Server Actions for the donation popup. The browser never talks to Laravel: these run on the Next
// server, which holds the API key and forwards the visitor's address so rate limits apply to the
// visitor. Card details never pass through here at all (the payment provider's own fields collect them
// and hand over a single-use token).

const GENERIC = `Something went wrong. Please try again, or email ${CONTACT_EMAIL}.`;

async function visitorIp(): Promise<Record<string, string>> {
  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "";

  return ip ? { "X-Forwarded-For": ip } : {};
}

async function call(
  path: string,
  init: { method: "GET" | "POST"; body?: unknown },
): Promise<{ status: number; json: unknown } | null> {
  try {
    const response = await fetch(`${env.apiUrl}${path}`, {
      method: init.method,
      headers: {
        Accept: "application/json",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...(env.apiKey ? { "X-Api-Key": env.apiKey } : {}),
        ...(init.method === "POST" ? await visitorIp() : {}),
      },
      body: init.body ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
    });

    return { status: response.status, json: await response.json().catch(() => null) };
  } catch {
    return null;
  }
}

/** What the form needs right now: whether giving is open, the amounts, and the events on offer. */
export async function loadDonationOptions(): Promise<DonationOptions | null> {
  const response = await call("/donation-options", { method: "GET" });

  if (!response || response.status !== 200) {
    return null;
  }

  return (response.json as { data: DonationOptions }).data;
}

export async function startDonation(
  input: DonationInput,
): Promise<StartDonationResult> {
  if (!env.apiKey) {
    return { ok: false, errors: {}, message: GENERIC };
  }

  const response = await call("/donations", {
    method: "POST",
    body: {
      ...input,
      currency: "CAD",
      event: input.event || undefined,
      phone: input.phone || undefined,
      address_line2: input.address_line2 || undefined,
      bot_token: input.bot_token || undefined,
    },
  });

  if (!response) {
    return { ok: false, errors: {}, message: GENERIC };
  }

  if (response.status === 200 || response.status === 201) {
    const data = (
      response.json as {
        data: {
          reference: string;
          status: string;
          amount_cents: number;
          gateway: { provider: string; test_mode?: boolean } | null;
        };
      }
    ).data;

    return {
      ok: true,
      reference: data.reference,
      status: data.status,
      amount_cents: data.amount_cents,
      provider: data.gateway?.provider ?? "",
      test_mode: data.gateway?.test_mode === true,
    };
  }

  if (response.status === 422) {
    const raw = (response.json as { errors?: Record<string, string[]> })?.errors ?? {};
    const errors: Record<string, string> = {};

    for (const [field, messages] of Object.entries(raw)) {
      if (messages[0]) {
        errors[field] = messages[0];
      }
    }

    return { ok: false, errors };
  }

  if (response.status === 403) {
    return {
      ok: false,
      errors: {},
      message: "Online donations are not open yet. Thank you for caring!",
    };
  }

  if (response.status === 429) {
    return {
      ok: false,
      errors: {},
      message: "Too many attempts. Please wait a minute and try again.",
    };
  }

  return { ok: false, errors: {}, message: GENERIC };
}

export async function confirmDonation(
  reference: string,
  paymentToken: string,
): Promise<ConfirmDonationResult> {
  if (!env.apiKey) {
    return { ok: false, message: GENERIC };
  }

  const response = await call(`/donations/${encodeURIComponent(reference)}/confirm`, {
    method: "POST",
    body: { payment_token: paymentToken },
  });

  if (!response) {
    return {
      ok: false,
      message: `We couldn't confirm your donation. Please don't try again yet — check your email or write to ${CONTACT_EMAIL}.`,
    };
  }

  // 200 = answered (a decline is an ordinary answer); 409 = already finished, here is how it ended.
  if (response.status === 200 || response.status === 409) {
    const data = (
      response.json as {
        data: {
          status: ConfirmDonationResultStatus;
          amount_cents: number;
          receipt_number: string | null;
          failure_reason: string | null;
        };
      }
    ).data;

    return {
      ok: true,
      status: data.status,
      amount_cents: data.amount_cents,
      receipt_number: data.receipt_number,
      failure_reason: data.failure_reason,
    };
  }

  if (response.status === 429) {
    return { ok: false, message: "Too many attempts. Please wait a minute and try again." };
  }

  const message = (response.json as { message?: string } | null)?.message;

  return { ok: false, message: message ?? GENERIC };
}

type ConfirmDonationResultStatus = Extract<
  ConfirmDonationResult,
  { ok: true }
>["status"];
