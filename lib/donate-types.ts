// Shapes shared by the donation form (client) and its Server Actions. Mirrors docs/plan/03-api-spec.md.

export type DonationOptions = {
  /** False while giving is closed (switched off in the admin, or no payment gateway on the server). */
  enabled: boolean;
  currency: "CAD";
  presets_cents: number[];
  min_cents: number;
  max_cents: number;
  /** True when no real money moves (development / staging). */
  test_mode: boolean;
  events: { slug: string; title: string }[];
};

export type DonationInput = {
  amount_cents: number;
  /** An event slug, or "" for a general donation. */
  event: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  province: string;
  postal_code: string;
  consent: boolean;
  /** One per attempt; the server returns the same donation for a repeated key. */
  idempotency_key: string;
  bot_token?: string;
};

export type StartDonationResult =
  | {
      ok: true;
      reference: string;
      status: string;
      amount_cents: number;
      provider: string;
      test_mode: boolean;
    }
  | { ok: false; errors: Record<string, string>; message?: string };

export type ConfirmDonationResult =
  | {
      ok: true;
      status: "succeeded" | "failed" | "pending" | "canceled" | "refunded" | "partially_refunded";
      amount_cents: number;
      receipt_number: string | null;
      failure_reason: string | null;
    }
  | { ok: false; message: string };

/** Tokens the test gateway understands (the real one will return a single-use token from its hosted fields). */
export const FAKE_APPROVE = "fake-approve";
export const FAKE_DECLINE = "fake-decline";
