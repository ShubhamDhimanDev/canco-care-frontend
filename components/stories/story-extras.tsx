import Link from "next/link";

import type { Story, TagRef } from "@/lib/api/types";

/** Tag chips linking to the tag pages. */
export function TagList({ tags }: { tags: TagRef[] }) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <ul
      aria-label="Tags"
      className="m-0 flex list-none flex-wrap justify-center gap-2 p-0"
    >
      {tags.map((tag) => (
        <li key={tag.slug}>
          <Link
            href={`/stories/tag/${tag.slug}`}
            className="inline-block rounded-full border border-brand-slate/40 px-3 py-1 text-[13px] font-semibold text-brand-slate-dark transition-colors hover:border-brand-orange hover:text-brand-orange"
          >
            {tag.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/**
 * The "quick answer" an editor wrote: the first thing a reader (or an answer engine) sees under the
 * title. Rendered as plain text, never HTML.
 */
export function QuickAnswer({ text }: { text: string }) {
  return (
    <aside
      aria-label="Quick answer"
      className="mt-6 rounded-[12px] border-l-4 border-brand-slate bg-white px-5 py-4 shadow-card"
    >
      <p className="m-0 text-[12px] font-bold tracking-[1.5px] text-brand-slate uppercase">
        In short
      </p>
      <p className="m-0 mt-1 text-[16px] leading-7 font-medium text-ink">
        {text}
      </p>
    </aside>
  );
}

/** Visible FAQ; the same questions are published as FAQPage structured data on the page. */
export function StoryFaq({ items }: { items: Story["faq"] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="story-faq" className="mt-12">
      <h2
        id="story-faq"
        className="m-0 mb-4 text-[24px] leading-8 font-bold text-brand-navy"
      >
        Frequently asked questions
      </h2>
      <div className="grid gap-3">
        {items.map((item) => (
          <details
            key={item.question}
            className="rounded-[12px] bg-white px-5 py-3 shadow-card"
          >
            <summary className="cursor-pointer text-[16px] leading-7 font-semibold text-brand-slate-dark">
              {item.question}
            </summary>
            <p className="m-0 mt-2 text-[16px] leading-7 text-ink">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
