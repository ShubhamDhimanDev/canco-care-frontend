import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { StoryGrid } from "@/components/stories/story-card";
import { Container } from "@/components/ui/container";
import { Eyebrow, PageTitle } from "@/components/ui/typography";
import { getStories, getTagParams, getTags } from "@/lib/api/stories";

// Tags that exist at build time are prerendered; a tag created later renders on first visit and is
// refreshed by the same "stories" cache tag as everything else.
export async function generateStaticParams() {
  return getTagParams();
}

async function findTag(slug: string) {
  return (await getTags()).find((tag) => tag.slug === slug);
}

export async function generateMetadata({
  params,
}: PageProps<"/stories/tag/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const tag = await findTag(slug);

  if (!tag) {
    return { title: "Tag not found", robots: { index: false } };
  }

  return {
    title: `Stories tagged “${tag.name}”`,
    description: `Canco Cares stories about ${tag.name}.`,
    alternates: { canonical: `/stories/tag/${tag.slug}` },
  };
}

async function TaggedStories({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: PageProps<"/stories/tag/[slug]">["searchParams"];
}) {
  const { page } = await searchParams;
  const raw = Array.isArray(page) ? page[0] : page;
  const current = Math.max(1, Number.parseInt(raw ?? "1", 10) || 1);

  const { data, meta } = await getStories(current, 9, slug);

  if (data.length === 0) {
    return (
      <p className="m-0 text-center text-[20px] leading-8 font-medium">
        There are no stories on this page.{" "}
        <Link
          href={`/stories/tag/${slug}`}
          className="underline underline-offset-4"
        >
          Back to the latest
        </Link>
        .
      </p>
    );
  }

  const base = `/stories/tag/${slug}`;

  return (
    <>
      <StoryGrid stories={data} wide />

      {meta.last_page > 1 && (
        <nav
          aria-label="Tagged stories pages"
          className="mt-[100px] flex items-center justify-center gap-6 text-[18px] font-semibold text-brand-slate-dark"
        >
          {current > 1 ? (
            <Link
              rel="prev"
              href={current === 2 ? base : `${base}?page=${current - 1}`}
              className="underline underline-offset-4"
            >
              ← Newer stories
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
          <span className="text-ink">
            Page {meta.current_page} of {meta.last_page}
          </span>
          {current < meta.last_page ? (
            <Link
              rel="next"
              href={`${base}?page=${current + 1}`}
              className="underline underline-offset-4"
            >
              Older stories →
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
        </nav>
      )}
    </>
  );
}

export default async function TagPage(props: PageProps<"/stories/tag/[slug]">) {
  const { slug } = await props.params;
  const tag = await findTag(slug);

  if (!tag) {
    notFound();
  }

  return (
    <div className="pt-[253px] pb-[100px] tablet:pt-[176px] phone:pt-[128px]">
      <Container>
        <div className="mb-[108px] text-center">
          <Eyebrow className="phone:text-[25px]">Stories tagged</Eyebrow>
          <PageTitle className="phone:text-[40px] phone:leading-[52px]">
            {tag.name.toUpperCase()}
          </PageTitle>
          <p className="mt-4 mb-0 text-[16px] font-medium">
            <Link
              href="/stories"
              className="text-brand-slate-dark underline underline-offset-4"
            >
              All stories
            </Link>
          </p>
        </div>
        <Suspense fallback={null}>
          <TaggedStories slug={slug} searchParams={props.searchParams} />
        </Suspense>
      </Container>
    </div>
  );
}
