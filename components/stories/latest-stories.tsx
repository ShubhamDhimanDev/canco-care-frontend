import { StoryGrid } from "@/components/stories/story-card";
import { getHomeStories, getLatestStories } from "@/lib/api/stories";

/**
 * Three story teasers (cached with the "stories" tag; refreshed when Laravel publishes).
 * `featuredFirst` is the home page: stories marked "feature on the home page" lead the list.
 */
export async function LatestStories({
  limit = 3,
  featuredFirst = false,
}: {
  limit?: number;
  featuredFirst?: boolean;
}) {
  const stories = featuredFirst
    ? await getHomeStories(limit)
    : await getLatestStories(limit);

  if (stories.length === 0) {
    return (
      <p className="m-0 text-center text-[20px] font-medium">
        No stories yet — check back soon.
      </p>
    );
  }

  return <StoryGrid stories={stories} />;
}
