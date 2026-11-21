// Security headers for every response (docs/plan/14 #7 and #8). Plain .mjs so next.config.ts can import it.
//
// Environment (read at BUILD time, because Next stores headers in the routes manifest — rebuild after changing):
//   CSP_MODE   = report-only (default) | enforce | off
//   HSTS_MODE  = short (default, 5 minutes, no subdomains — right for staging) | full (1 year + subdomains,
//                production only) | off
//   NEXT_PUBLIC_ALLOW_INDEXING = true only on production; otherwise every response is noindex.
//
// No nonces on purpose: a nonce forces every page to render per request, which would undo Cache Components.
// This is the non-nonce policy from Next's own CSP guide; tighten with SRI later if required.

const isDev = process.env.NODE_ENV === "development";

/** The Laravel origin that serves story/event images (they are shown through next/image, but allow it directly too). */
function apiOrigin() {
  try {
    return process.env.API_URL ? new URL(process.env.API_URL).origin : null;
  } catch {
    return null;
  }
}

function contentSecurityPolicy(enforce) {
  const api = apiOrigin();
  const turnstile = "https://challenges.cloudflare.com";

  const directives = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      turnstile,
      ...(isDev ? ["'unsafe-eval'"] : []),
    ],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:", ...(api ? [api] : [])],
    "font-src": ["'self'", "data:"],
    "connect-src": ["'self'", turnstile, ...(isDev ? ["ws:", "wss:"] : [])],
    "frame-src": [turnstile],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    // Browsers ignore (and warn about) this directive in a report-only policy.
    ...(isDev || !enforce ? {} : { "upgrade-insecure-requests": [] }),
  };

  return Object.entries(directives)
    .map(([name, values]) => [name, ...values].join(" "))
    .join("; ");
}

export function securityHeaders() {
  const headers = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), payment=(self)",
    },
  ];

  const csp = process.env.CSP_MODE ?? "report-only";
  if (csp === "enforce") {
    headers.push({
      key: "Content-Security-Policy",
      value: contentSecurityPolicy(true),
    });
  } else if (csp !== "off") {
    headers.push({
      key: "Content-Security-Policy-Report-Only",
      value: contentSecurityPolicy(false),
    });
  }

  const hsts = process.env.HSTS_MODE ?? "short";
  if (hsts === "full") {
    headers.push({
      key: "Strict-Transport-Security",
      value: "max-age=31536000; includeSubDomains",
    });
  } else if (hsts !== "off") {
    headers.push({ key: "Strict-Transport-Security", value: "max-age=300" });
  }

  if (process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "true") {
    headers.push({ key: "X-Robots-Tag", value: "noindex, nofollow" });
  }

  return headers;
}
