/**
 * Search-engine indexing is OFF unless `NEXT_PUBLIC_ALLOW_INDEXING=true` is set (production only), so a
 * staging or demo copy can never end up in Google by accident. When off: robots.txt disallows everything,
 * the sitemap is empty, every page carries `noindex` and an `X-Robots-Tag` header (see next.config.ts).
 * Forgetting the flag at launch hides the site rather than leaking staging: it is on the go-live checklist.
 */
export const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
