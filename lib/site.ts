// Site-wide constants. Copy and URLs come from the live site (docs/research/01-live-site-overview.md).

export const SITE_NAME = "Canco Cares";
export const SITE_TAGLINE = "Fueling Hope Across Canada";
export const SITE_DESCRIPTION =
  "Canco Cares uplifts Canadian communities and families through community projects and strategic partnerships. Donate or partner with us.";

/** Canonical origin; used for canonical URLs, Open Graph and the sitemap. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

export const CONTACT_EMAIL = "inquiry@cancocares.ca";

export const SOCIAL = {
  facebook: "https://www.facebook.com/profile.php?id=61566542968163",
  instagram: "https://www.instagram.com/cancocares?igsh=YWVwdHJrdnpoeWhq",
  linkedin: "https://www.linkedin.com/company/104790620",
} as const;

export const INSTAGRAM_HANDLE = "cancocares";

export type NavLink = { label: string; href: string };

/** Header navigation (desktop and mobile menu). */
export const MAIN_NAV: NavLink[] = [
  { label: "Who We Are", href: "/who-we-are" },
  { label: "Our Impact", href: "/our-impact" },
  { label: "Upcoming Events", href: "/upcoming-events" },
  { label: "Contact Us", href: "/contact-us" },
];

/** Footer "Site Map" column. */
export const FOOTER_SITE_MAP: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Who We Are", href: "/who-we-are" },
  { label: "Upcoming Events", href: "/upcoming-events" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Terms and Conditions", href: "/terms-and-conditions" },
];

/** Footer "Our Impact" column. */
export const FOOTER_IMPACT: NavLink[] = [
  { label: "Inquiries", href: "/contact-us" },
  { label: "Latest Stories", href: "/stories" },
];

export const FOOTER_TAGLINE =
  "Together, we can uplift our local communities and create lasting change.";
export const FOOTER_TAGLINE_BOLD =
  "Your support helps make a meaningful impact - join us in making a difference today!";

/** The headline impact figure. Hard-coded on the live site; to become an admin setting (Q-C4). */
export const IMPACT = {
  amount: "$80,000",
  caption: "AND COUNTING!",
  blurb:
    "Canco Cares is already impacting families and communities, with plans for rapid expansion. We're proud partners of the Make-A-Wish Foundation, having donated over $80,000. Our mission is to give back to communities and families, creating a ripple of positive change in our society.",
} as const;
