import { StoryGrid } from "@/components/stories/story-card";
import { getLatestStories } from "@/lib/api/stories";

/** The three newest stories (cached with the "stories" tag; refreshed when Laravel publishes). */
export async function LatestStories({ limit = 3 }: { limit?: number }) {
  const stories = await getLatestStories(limit);

  if (stories.length === 0) {
    return (
      <p className="m-0 text-center text-[20px] font-medium">
        No stories yet — check back soon.
      </p>
    );
  }

  return <StoryGrid stories={stories} />;
}
