import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import "./globals.css";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/site";

// Montserrat (variable weight), self-hosted from the same file the live site serves — no network
// access is needed at build time. Latin only: it covers English and French accents.
const montserrat = localFont({
  src: "./fonts/montserrat-latin-wght-normal.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    types: { "application/rss+xml": "/stories/feed.xml" },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_CA",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/images/homeBannerImg.webp",
        width: 596,
        height: 497,
        alt: "A father and daughter hugging",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#f5f6fa",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-CA" className={montserrat.variable}>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only z-[60] rounded-md bg-white px-4 py-2 font-semibold text-brand-navy focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
        >
          Skip to content
        </a>
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main id="main" className="flex-1 bg-page">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
