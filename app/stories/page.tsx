import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { StoryGrid } from "@/components/stories/story-card";
import { Container } from "@/components/ui/container";
import { FilterBar } from "@/components/ui/filter-bar";
import { Eyebrow, PageTitle } from "@/components/ui/typography";
import {
  getStories,
  getTags,
  searchStories,
  STORIES_PAGE_SIZE,
} from "@/lib/api/stories";
import { pageParam, param, withParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "News and stories from the communities Canco Cares serves across Canada.",
  alternates: { canonical: "/stories" },
};

function StoriesSkeleton() {
  return (
    <ul
      aria-busy="true"
      aria-label="Loading stories"
      className="m-0 flex list-none flex-wrap justify-center gap-x-6 gap-y-[120px] p-0"
    >
      {[0, 1, 2].map((key) => (
        <li
          key={key}
          className="h-[330px] w-full animate-pulse rounded-[16px] bg-white shadow-card md:w-[336px] lg:w-[416px]"
        />
      ))}
    </ul>
  );
}

/** Reads `?q=`, `?tag=` and `?page=` (runtime values, hence the Suspense boundary above), then renders the search bar and the list. */
async function StoriesBrowser({
  searchParams,
}: Pick<PageProps<"/stories">, "searchParams">) {
  const params = await searchParams;
  const q = param(params.q);
  const current = pageParam(params.page);

  const tags = await getTags();
  // Only a topic that exists counts; anything else in the address is ignored.
  const tag = tags.find((item) => item.slug === param(params.tag, 60));
  const filtered = q !== "" || tag !== undefined;

  const { data, meta } = q
    ? await searchStories(q, current, tag?.slug)
    : await getStories(current, STORIES_PAGE_SIZE, tag?.slug);

  const link = (page: number) =>
    withParams("/stories", { q, tag: tag?.slug, page });

  return (
    <>
      <FilterBar
        action="/stories"
        label="Search stories"
        placeholder="Search stories"
        query={q}
        select={
          tags.length > 0
            ? {
                name: "tag",
                label: "Topic",
                value: tag?.slug ?? "",
                options: [
                  { value: "", label: "All topics" },
                  ...tags.map((item) => ({
                    value: item.slug,
                    label: item.name,
                  })),
                ],
              }
            : undefined
        }
        clearHref={filtered ? "/stories" : undefined}
      />

      {filtered && data.length > 0 && (
        <p
          role="status"
          className="mt-0 mb-[60px] text-center text-[18px] font-medium text-brand-slate-dark"
        >
          {meta.total} {meta.total === 1 ? "story" : "stories"}
          {q && <> matching “{q}”</>}
          {tag && <> in {tag.name}</>}
        </p>
      )}

      {data.length === 0 ? (
        <p
          role="status"
          className="m-0 text-center text-[20px] leading-8 font-medium"
        >
          {filtered ? (
            <>
              No stories match your search.{" "}
              <Link href="/stories" className="underline underline-offset-4">
                Show all stories
              </Link>
              .
            </>
          ) : current > 1 ? (
            <>
              There are no stories on this page.{" "}
              <Link href="/stories" className="underline underline-offset-4">
                Back to the latest stories
              </Link>
              .
            </>
          ) : (
            "No stories yet — check back soon."
          )}
        </p>
      ) : (
        <StoryGrid stories={data} wide />
      )}

      {meta.last_page > 1 && data.length > 0 && (
        <nav
          aria-label="Stories pages"
          className="mt-[100px] flex items-center justify-center gap-6 text-[18px] font-semibold text-brand-slate-dark"
        >
          {current > 1 ? (
            <Link
              rel="prev"
              href={link(current - 1)}
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
              href={link(current + 1)}
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

export default function StoriesPage(props: PageProps<"/stories">) {
  return (
    <div className="pt-[253px] pb-[100px] tablet:pt-[176px] phone:pt-[128px]">
      <Container>
        <div className="mb-[108px] text-center">
          <Eyebrow className="phone:text-[25px]">Our</Eyebrow>
          <PageTitle className="phone:text-[54px] phone:leading-[64.8px]">
            STORIES
          </PageTitle>
        </div>
        <Suspense fallback={<StoriesSkeleton />}>
          <StoriesBrowser searchParams={props.searchParams} />
        </Suspense>
      </Container>
    </div>
  );
}
