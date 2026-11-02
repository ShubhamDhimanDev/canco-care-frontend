import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import {
  QuickAnswer,
  StoryFaq,
  TagList,
} from "@/components/stories/story-extras";
import { Container } from "@/components/ui/container";
import { getStory, getStoryParams } from "@/lib/api/stories";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { formatDate } from "@/lib/utils";

// Stories that exist at build time are prerendered; anything published later renders on first visit,
// is cached, and is refreshed by Laravel's revalidation call (tags "stories" and "story:{slug}").
export async function generateStaticParams() {
  return getStoryParams();
}

export async function generateMetadata({
  params,
}: PageProps<"/stories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const result = await getStory(slug);

  if (result.kind !== "found") {
    return { title: "Story not found", robots: { index: false } };
  }

  const { story } = result;
  const title = story.meta_title ?? story.title;
  const description =
    story.meta_description ?? story.summary ?? story.excerpt;

  return {
    title,
    description,
    keywords: story.tags.map((tag) => tag.name),
    robots: story.noindex ? { index: false, follow: true } : undefined,
    alternates: { canonical: `/stories/${story.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: story.published_at ?? undefined,
      modifiedTime: story.updated_at ?? undefined,
      tags: story.tags.map((tag) => tag.name),
      images: story.image
        ? [
            {
              url: story.image.url,
              width: story.image.width ?? undefined,
              height: story.image.height ?? undefined,
              alt: story.image.alt ?? story.title,
            },
          ]
        : undefined,
    },
    twitter: { card: story.image ? "summary_large_image" : "summary" },
  };
}

export default async function StoryPage({
  params,
}: PageProps<"/stories/[slug]">) {
  const { slug } = await params;
  const result = await getStory(slug);

  if (result.kind === "moved") {
    permanentRedirect(`/stories/${result.slug}`);
  }

  if (result.kind === "missing") {
    notFound();
  }

  const { story } = result;

  const url = `${SITE_URL}/stories/${story.slug}`;
  const faq = story.faq.filter((item) => item.question && item.answer);

  // One @graph: the article, where it sits on the site, and (when the editor wrote any) the FAQ.
  // Answer engines and search engines read these to quote the page accurately.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: story.title,
        description: story.meta_description ?? story.summary ?? story.excerpt,
        abstract: story.summary ?? undefined,
        datePublished: story.published_at ?? undefined,
        dateModified: story.updated_at ?? story.published_at ?? undefined,
        image: story.image?.url,
        keywords:
          story.tags.length > 0
            ? story.tags.map((tag) => tag.name).join(", ")
            : undefined,
        articleSection: story.tags[0]?.name,
        timeRequired: `PT${story.reading_minutes}M`,
        inLanguage: "en-CA",
        author: story.author_name
          ? { "@type": "Person", name: story.author_name }
          : { "@type": "Organization", name: SITE_NAME },
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        mainEntityOfPage: url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Stories",
            item: `${SITE_URL}/stories`,
          },
          { "@type": "ListItem", position: 3, name: story.title, item: url },
        ],
      },
      ...(faq.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <article className="pt-[253px] pb-[116px] tablet:pt-[176px] phone:pt-[138px]">
      <Container>
        <div className="mx-auto md:max-w-[calc((100%+24px)*11/12-24px)] lg:max-w-[calc((100%+24px)*2/3-24px)]">
          {story.image && (
            <Image
              src={story.image.url}
              alt={story.image.alt ?? ""}
              width={story.image.width ?? 600}
              height={story.image.height ?? 400}
              priority
              sizes="(min-width: 992px) 514px, (min-width: 768px) 382px, 260px"
              className="mx-auto block h-[300px] w-[60%] rounded-[16px] object-cover object-center shadow-card phone:h-[200px] phone:w-[85%]"
            />
          )}

          <div className="px-10 pb-10 phone:px-5">
            <header className="mt-[30px] text-center phone:mt-5">
              <h1 className="m-0 text-[30px] leading-[46px] font-bold text-brand-slate phone:text-[24px] phone:leading-9">
                {story.title}
              </h1>
              {story.published_at && (
                <p className="mt-2 mb-0 text-[14px] font-medium text-ink">
                  <time dateTime={story.published_at}>
                    {formatDate(story.published_at)}
                  </time>
                  {story.author_name ? ` · ${story.author_name}` : ""}
                  {` · ${story.reading_minutes} min read`}
                </p>
              )}
              {story.tags.length > 0 && (
                <div className="mt-4">
                  <TagList tags={story.tags} />
                </div>
              )}
            </header>

            {story.summary && <QuickAnswer text={story.summary} />}

            {/* Sanitised HTML from the Laravel admin (ADR-001). */}
            <div
              className="story-body mt-5"
              dangerouslySetInnerHTML={{ __html: story.body }}
            />

            <StoryFaq items={faq} />

            <nav
              aria-label="More stories"
              className="mt-14 flex flex-wrap items-start justify-between gap-6 text-[16px] font-semibold text-brand-slate-dark"
            >
              {story.prev ? (
                <Link
                  rel="prev"
                  href={`/stories/${story.prev.slug}`}
                  className="max-w-[45%] underline underline-offset-4"
                >
                  <span className="block text-[13px] font-medium text-ink">
                    ← Older story
                  </span>
                  {story.prev.title}
                </Link>
              ) : (
                <span aria-hidden="true" />
              )}
              {story.next ? (
                <Link
                  rel="next"
                  href={`/stories/${story.next.slug}`}
                  className="max-w-[45%] text-right underline underline-offset-4"
                >
                  <span className="block text-[13px] font-medium text-ink">
                    Newer story →
                  </span>
                  {story.next.title}
                </Link>
              ) : (
                <span aria-hidden="true" />
              )}
            </nav>

            <p className="mt-10 mb-0 text-center">
              <Link
                href="/stories"
                className="text-[16px] font-semibold text-brand-slate-dark underline underline-offset-4"
              >
                All stories
              </Link>
            </p>
          </div>
        </div>
      </Container>

      <script
        type="application/ld+json"
        // "<" is escaped so story text can never close the script tag.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </article>
  );
}
