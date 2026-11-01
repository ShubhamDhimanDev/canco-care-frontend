// Mirrors docs/plan/03-api-spec.md. Keep in step with the API; change the spec first.

export type ApiImage = {
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
};

export type TagRef = { slug: string; name: string };

export type Tag = TagRef & { count: number };

export type StoryCard = {
  slug: string;
  title: string;
  excerpt: string;
  image: ApiImage | null;
  tags: TagRef[];
  /** Editors can ask search engines to skip a story; it is also left out of the sitemap. */
  noindex: boolean;
  /** ISO-8601, UTC. */
  published_at: string | null;
};

export type StoryLink = { slug: string; title: string };

export type Story = StoryCard & {
  /** Sanitised HTML produced by the admin. */
  body: string;
  /** "Quick answer": one or two sentences shown above the story and quoted by answer engines. */
  summary: string | null;
  faq: { question: string; answer: string }[];
  reading_minutes: number;
  author_name: string | null;
  meta_title: string | null;
  meta_description: string | null;
  updated_at: string | null;
  /** The next-older and next-newer public stories. */
  prev: StoryLink | null;
  next: StoryLink | null;
};

export type Paginated<T> = {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

/** What looking up a story by slug can mean. */
export type StoryLookup =
  | { kind: "found"; story: Story }
  | { kind: "moved"; slug: string }
  | { kind: "missing" };

/** The home page document (docs/plan/13 §4). An image the editor never chose is `null`: use the bundled one. */
export type HomeContent = {
  hero: {
    title: string;
    text: string;
    primary_label: string;
    secondary_label: string;
    secondary_href: string;
    image: ApiImage | null;
  };
  intro: {
    eyebrow: string;
    title: string;
    text: string;
    button_label: string;
    button_href: string;
  };
  cards: {
    image: ApiImage | null;
    eyebrow: string;
    title: string;
    text: string;
  }[];
  stories: { eyebrow: string; title: string };
};

export type EventCard = {
  slug: string;
  title: string;
  summary: string;
  image: ApiImage | null;
  /** ISO-8601, UTC. Show it in `timezone`. */
  starts_at: string;
  ends_at: string | null;
  timezone: string;
  is_all_day: boolean;
  location_name: string | null;
  city: string | null;
  province: string | null;
  is_online: boolean;
  cost_note: string | null;
  status: "published" | "cancelled";
  is_featured: boolean;
};

export type Event = EventCard & {
  /** Sanitised HTML produced by the admin. */
  description: string | null;
  address: {
    line1: string | null;
    line2: string | null;
    city: string | null;
    province: string | null;
    postal_code: string | null;
  } | null;
  online_url: string | null;
  registration_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  updated_at: string | null;
};

export type EventLookup =
  | { kind: "found"; event: Event }
  | { kind: "moved"; slug: string }
  | { kind: "missing" };

/** What the admin lets an editor change that the site shows (docs/plan/03-api-spec.md "PublicSettings"). */
export type PublicSettings = {
  impact: { amount_text: string; caption: string; blurb: string };
  social: { facebook: string; instagram: string; linkedin: string };
  contact: { inquiry_email: string };
  donations: { enabled: boolean; currency: "CAD" };
};
