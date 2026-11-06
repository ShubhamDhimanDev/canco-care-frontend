import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { LIVE } from "@/lib/api/cache";
import { apiGet, ApiError } from "@/lib/api/client";
import type { HomeContent } from "@/lib/api/types";

/**
 * The home page's copy and pictures, edited in the admin ("Home page"). Laravel merges the editor's
 * changes over the original text, so every field is always present. Cached with the "settings" tag.
 */
export async function getHome(): Promise<HomeContent> {
  "use cache";
  cacheLife(LIVE);
  cacheTag("settings");

  const { body } = await apiGet<{ data: HomeContent }>("/home");

  if (!body) {
    throw new ApiError("The home page content came back empty.", 502, "/home");
  }

  return body.data;
}
