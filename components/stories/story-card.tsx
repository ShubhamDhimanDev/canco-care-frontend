import Image from "next/image";

import { Button } from "@/components/ui/button";
import type { StoryCard as StoryCardData } from "@/lib/api/types";

/**
 * A story teaser: photo lifted over the top edge, title, excerpt and an orange button that
 * hangs over the bottom edge. Same card on the home, impact and stories pages.
 */
export function StoryCard({ story }: { story: StoryCardData }) {
  return (
    <article className="relative flex h-full flex-col items-center justify-center gap-5 rounded-[16px] bg-white px-[43px] pb-[53px] shadow-card tablet:px-[27px] tablet:pb-[46px]">
      {story.image && (
        <Image
          src={story.image.url}
          alt={story.image.alt ?? ""}
          width={story.image.width ?? 600}
          height={story.image.height ?? 400}
          sizes="(min-width: 992px) 322px, (min-width: 576px) 50vw, 100vw"
          className="-mt-[50px] h-[197px] w-full rounded-[16px] object-cover object-center shadow-card"
        />
      )}
      <h3 className="m-0 text-center text-[22px] leading-8 font-bold text-brand-slate">
        {story.title}
      </h3>
      <p className="m-0 text-center text-[14px] leading-6 font-medium text-ink">
        {story.excerpt}
      </p>
      <Button
        variant="secondary"
        href={`/stories/${story.slug}`}
        aria-label={`Read more: ${story.title}`}
        className="absolute bottom-[-27px] left-1/2 w-full max-w-[50%] -translate-x-1/2 text-center tablet:max-w-[70%]"
      >
        Read more
      </Button>
    </article>
  );
}

/**
 * Responsive grid of story cards (3 / 2 / 1 columns). The 120 px row gap leaves room for the hanging buttons.
 * `wide` is the stories index, whose cards are a little wider than the teasers on the home and impact pages.
 */
export function StoryGrid({
  stories,
  wide = false,
}: {
  stories: StoryCardData[];
  wide?: boolean;
}) {
  return (
    <ul className="m-0 flex list-none flex-wrap justify-center gap-x-6 gap-y-[120px] p-0">
      {stories.map((story) => (
        <li key={story.slug} className={
            wide
              ? "w-full md:w-[336px] lg:w-[416px]"
              : "w-[calc(100%-24px)] max-w-[408px] md:w-[324px] md:max-w-none lg:w-[408px]"
          }>
          <StoryCard story={story} />
        </li>
      ))}
    </ul>
  );
}
