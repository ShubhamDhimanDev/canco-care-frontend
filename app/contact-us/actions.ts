"use server";

import { headers } from "next/headers";

import { env } from "@/lib/env";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

export type ContactState =
  | { status: "idle" }
  | { status: "success"; reference: string; firstName: string }
  | {
      status: "error";
      /** A problem that is not about one field (rate limit, server down, not configured). */
      message?: string;
      /** The first message for each field Laravel rejected, keyed by field name. */
      errors: Record<string, string>;
      /** What the visitor typed, so the form can be filled in again. */
      values: Record<string, string>;
    };

const FIELDS = [
  "first_name",
  "last_name",
  "phone",
  "email",
  "inquiry_type",
  "message",
] as const;

const FALLBACK = `Something went wrong. Please try again, or email ${CONTACT_EMAIL}.`;

/**
 * Sends the contact form to Laravel. The browser never talks to Laravel: this runs on the Next
 * server, which holds the API key and forwards the visitor's address so rate limits apply to the
 * visitor, not to this server.
 */
export async function submitInquiry(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const text = (name: string) => {
    const value = formData.get(name);

    return typeof value === "string" ? value : "";
  };

  const values = Object.fromEntries(FIELDS.map((name) => [name, text(name)]));
  const fail = (
    errors: Record<string, string> = {},
    message?: string,
  ): ContactState => ({ status: "error", errors, values, message });

  if (!env.apiKey) {
    return fail({}, FALLBACK);
  }

  const requestHeaders = await headers();
  const visitorIp =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "";

  let response: Response;

  try {
    response = await fetch(`${env.apiUrl}/inquiries`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Api-Key": env.apiKey,
        ...(visitorIp ? { "X-Forwarded-For": visitorIp } : {}),
      },
      body: JSON.stringify({
        ...values,
        inquiry_type: values.inquiry_type || undefined,
        consent: text("consent") === "on",
        website: text("website"),
        bot_token: text("cf-turnstile-response") || undefined,
        source_url: `${SITE_URL}/contact-us`,
      }),
      cache: "no-store",
    });
  } catch {
    return fail({}, FALLBACK);
  }

  if (response.status === 201) {
    const body = (await response.json().catch(() => null)) as {
      data?: { reference?: string };
    } | null;

    return {
      status: "success",
      reference: body?.data?.reference ?? "",
      firstName: values.first_name.trim(),
    };
  }

  if (response.status === 422) {
    const body = (await response.json().catch(() => null)) as {
      errors?: Record<string, string[]>;
    } | null;
    const errors: Record<string, string> = {};

    for (const [field, messages] of Object.entries(body?.errors ?? {})) {
      if (messages[0]) {
        errors[field] = messages[0];
      }
    }

    return fail(errors);
  }

  if (response.status === 429) {
    return fail(
      {},
      "You're sending messages too quickly. Please wait a minute and try again.",
    );
  }

  return fail({}, FALLBACK);
}
