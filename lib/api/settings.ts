import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { LIVE } from "@/lib/api/cache";
import { apiGet, ApiError } from "@/lib/api/client";
import type { PublicSettings } from "@/lib/api/types";

/**
 * Settings edited in the admin (impact figure, links, contact address). Cached with the "settings" tag:
 * Laravel refreshes it when an administrator saves, and when a donation succeeds (the impact figure can
 * follow real donations).
 */
export async function getSettings(): Promise<PublicSettings> {
  "use cache";
  cacheLife(LIVE);
  cacheTag("settings");

  const { body } = await apiGet<{ data: PublicSettings }>("/settings");

  if (!body) {
    throw new ApiError("The settings came back empty.", 502, "/settings");
  }

  return body.data;
}
