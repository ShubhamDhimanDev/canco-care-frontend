import "server-only";

/**
 * Server-side configuration. Values are read lazily so that a page which does not need a
 * setting (or a build step that does not touch the API) is not broken by its absence.
 */
function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env.local and fill it in.`,
    );
  }

  return value;
}

export const env = {
  /** Base URL of the Laravel API, e.g. https://admin.cancocares.ca/api/v1 (no trailing slash). */
  get apiUrl(): string {
    return required("API_URL").replace(/\/+$/, "");
  },
  /** Sent as X-Api-Key; optional for reads, required for writes. */
  get apiKey(): string | undefined {
    return process.env.API_KEY || undefined;
  },
  /** Shared secret Laravel presents to /api/revalidate. */
  get revalidateSecret(): string | undefined {
    return process.env.REVALIDATE_SECRET || undefined;
  },
};
