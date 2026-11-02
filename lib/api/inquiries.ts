import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { apiGet } from "@/lib/api/client";

export type InquiryTopic = { slug: string; name: string };

/**
 * The topics for the contact form's dropdown (managed in the admin under Settings › Inquiry topics).
 * The addresses they are sent to never leave Laravel. Cached with the "settings" tag.
 */
export async function getInquiryTopics(): Promise<InquiryTopic[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("settings");

  const { body } = await apiGet<{ data: InquiryTopic[] }>("/inquiry-types");

  return body?.data ?? [];
}
