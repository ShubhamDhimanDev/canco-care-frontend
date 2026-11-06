import type { NextConfig } from "next";

// Images uploaded in the admin are served by the Laravel app (/storage/...). Allow exactly that origin.
const apiOrigin = process.env.API_URL ? new URL(process.env.API_URL) : null;

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
    // Edits made in the admin must show on the next click. The browser's router cache may otherwise reuse
    // a page it already has for minutes (see lib/api/cache.ts for the per-page `stale: 0`). Next does not
    // accept less than 30 s for prefetched static pages, so that is the floor; nothing else is reused.
    staleTimes: { dynamic: 0, static: 30 },
  },
  cacheComponents: true,
  // Deliberately OFF (the create-next-app default was on). With it on, a story published after the
  // build is served from an "app shell" whose response has already started streaming, so an unknown
  // slug answers HTTP 200 (a "soft 404" with only a noindex tag). With it off, the first request waits
  // for the full render and `notFound()` returns a real 404, while new stories still render on demand
  // and are cached. Verified: /stories/does-not-exist → 404. Revisit only if navigation prefetching
  // matters more than status codes. See docs/plan/04-frontend.md.
  partialPrefetching: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    qualities: [75],
    remotePatterns: apiOrigin
      ? [
          {
            protocol: apiOrigin.protocol.replace(":", "") as "http" | "https",
            hostname: apiOrigin.hostname,
            port: apiOrigin.port,
            pathname: "/storage/**",
          },
        ]
      : [],
    // Next 16 refuses to optimise images from localhost/private addresses. Allow that in development only.
    dangerouslyAllowLocalIP:
      process.env.NODE_ENV !== "production" ||
      process.env.ALLOW_LOCAL_IMAGE_HOST === "true",
  },
};

export default nextConfig;
