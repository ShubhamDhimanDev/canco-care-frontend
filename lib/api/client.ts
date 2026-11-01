import "server-only";

import { env } from "@/lib/env";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly url: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type ApiResponse<T> = { status: number; body: T | null };

/**
 * GET from the Laravel API. Server-side only: the browser never talks to Laravel.
 *
 * Returns the status and parsed body for 2xx, 301 and 404 (all meaningful in this API);
 * anything else — including being unable to reach the API — throws an ApiError, which
 * callers inside `use cache` functions deliberately let propagate so a failure is never cached.
 */
export async function apiGet<T>(path: string): Promise<ApiResponse<T>> {
  const url = `${env.apiUrl}${path}`;
  const headers: Record<string, string> = { Accept: "application/json" };

  if (env.apiKey) {
    headers["X-Api-Key"] = env.apiKey;
  }

  let response: Response;

  try {
    response = await fetch(url, { headers, redirect: "manual" });
  } catch (cause) {
    throw new ApiError(
      `Cannot reach the API at ${url}. Is the Laravel app running? (${cause instanceof Error ? cause.message : cause})`,
      0,
      url,
    );
  }

  if (response.ok || response.status === 301 || response.status === 404) {
    const body = (await response.json().catch(() => null)) as T | null;

    return { status: response.status, body };
  }

  throw new ApiError(`API ${response.status} for ${url}`, response.status, url);
}
