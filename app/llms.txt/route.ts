import { getStories } from "@/lib/api/stories";
import {
  CONTACT_EMAIL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

/**
 * llms.txt: a plain-text map of the site for AI assistants and answer engines (the llmstxt.org
 * convention): what the organisation is, where the key pages are, and the latest stories.
 */
export async function GET() {
  const { data } = await getStories(1, 10);

  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "## About",
    `- [Who we are](${SITE_URL}/who-we-are): our mission, vision and values`,
    `- [Our impact](${SITE_URL}/our-impact): what our community projects and partnerships have achieved`,
    `- [Partner with us](${SITE_URL}/partner-with-us): how businesses and organisations can partner with Canco Cares`,
    "",
    "## Get involved",
    `- [Upcoming events](${SITE_URL}/upcoming-events): fundraisers and community events`,
    `- [Contact us](${SITE_URL}/contact-us): questions and enquiries (${CONTACT_EMAIL})`,
    "",
    "## Latest stories",
    ...data
      .filter((story) => !story.noindex)
      .map(
        (story) =>
          `- [${story.title}](${SITE_URL}/stories/${story.slug}): ${story.excerpt.replace(/\s+/g, " ")}`,
      ),
    "",
    "## Optional",
    `- [All stories](${SITE_URL}/stories)`,
    `- [Stories RSS feed](${SITE_URL}/stories/feed.xml)`,
    `- [Terms and conditions](${SITE_URL}/terms-and-conditions)`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=900, stale-while-revalidate=3600",
    },
  });
}
