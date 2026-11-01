import { createHash, timingSafeEqual } from "node:crypto";

import { revalidateTag } from "next/cache";

import { env } from "@/lib/env";

// Laravel calls this when content changes (ADR-003):
//   POST /api/revalidate   Authorization: Bearer <REVALIDATE_SECRET>   { "tags": ["stories", "story:my-slug"] }
// Tags are expired immediately (`expire: 0`), not stale-while-revalidate: the next request renders fresh
// content, so an unpublished or corrected story is never served again. The cost is that one visitor waits
// for that render; verified end to end with scratch Laravel + Next (see docs/qa).

const MAX_TAGS = 50;
const ALLOWED_TAG = /^(stories|events|settings|(story|event|page):[a-z0-9-]{1,220})$/;

/** Constant-time comparison; hashing first makes the two buffers the same length. */
function safeEqual(a: string, b: string): boolean {
  const digest = (value: string) => createHash("sha256").update(value).digest();

  return timingSafeEqual(digest(a), digest(b));
}

export async function POST(request: Request) {
  const secret = env.revalidateSecret;

  if (!secret) {
    return Response.json(
      { message: "Revalidation is not configured on this server." },
      { status: 503 },
    );
  }

  const header = request.headers.get("authorization") ?? "";
  const given = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!safeEqual(given, secret)) {
    return Response.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body: unknown = await request.json().catch(() => null);
  const tags =
    typeof body === "object" && body !== null && "tags" in body
      ? (body as { tags: unknown }).tags
      : null;

  if (
    !Array.isArray(tags) ||
    tags.length === 0 ||
    tags.length > MAX_TAGS ||
    !tags.every((tag) => typeof tag === "string" && ALLOWED_TAG.test(tag))
  ) {
    return Response.json(
      { message: `"tags" must be 1–${MAX_TAGS} known tags.` },
      { status: 422 },
    );
  }

  const unique = [...new Set(tags as string[])];

  for (const tag of unique) {
    revalidateTag(tag, { expire: 0 });
  }

  return Response.json({ revalidated: unique });
}
