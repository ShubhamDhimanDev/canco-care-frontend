// Mirrors docs/plan/03-api-spec.md. Keep in step with the API; change the spec first.

export type ApiImage = {
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
};

export type StoryCard = {
  slug: string;
  title: string;
  excerpt: string;
  image: ApiImage | null;
  /** ISO-8601, UTC. */
  published_at: string | null;
};

export type StoryLink = { slug: string; title: string };

export type Story = StoryCard & {
  /** Sanitised HTML produced by the admin. */
  body: string;
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
