import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { StoryGrid } from "@/components/stories/story-card";
import { Container } from "@/components/ui/container";
import { Eyebrow, PageTitle } from "@/components/ui/typography";
import { getStories } from "@/lib/api/stories";

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

/** Reads `?page=` (a runtime value, hence the Suspense boundary above it), then renders from the cached list. */
async function StoriesList({
  searchParams,
}: Pick<PageProps<"/stories">, "searchParams">) {
  const { page } = await searchParams;
  const raw = Array.isArray(page) ? page[0] : page;
  const current = Math.max(1, Number.parseInt(raw ?? "1", 10) || 1);

  const { data, meta } = await getStories(current);

  if (data.length === 0) {
    return (
      <p className="m-0 text-center text-[20px] leading-8 font-medium">
        {current > 1 ? (
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
    );
  }

  return (
    <>
      <StoryGrid stories={data} wide />

      {meta.last_page > 1 && (
        <nav
          aria-label="Stories pages"
          className="mt-[100px] flex items-center justify-center gap-6 text-[18px] font-semibold text-brand-slate-dark"
        >
          {current > 1 ? (
            <Link
              rel="prev"
              href={current === 2 ? "/stories" : `/stories?page=${current - 1}`}
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
              href={`/stories?page=${current + 1}`}
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
          <PageTitle className="phone:text-[54px] phone:leading-[64.8px]">STORIES</PageTitle>
        </div>
        <Suspense fallback={<StoriesSkeleton />}>
          <StoriesList searchParams={props.searchParams} />
        </Suspense>
      </Container>
    </div>
  );
}
