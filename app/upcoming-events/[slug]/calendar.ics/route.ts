import { getEvent } from "@/lib/api/events";
import { buildIcs } from "@/lib/ics";

/** "Add to calendar": GET /upcoming-events/{slug}/calendar.ics */
export async function GET(
  _request: Request,
  { params }: RouteContext<"/upcoming-events/[slug]/calendar.ics">,
) {
  const { slug } = await params;
  const result = await getEvent(slug);

  if (result.kind === "moved") {
    return Response.redirect(
      new URL(
        `/upcoming-events/${result.slug}/calendar.ics`,
        _request.url,
      ),
      308,
    );
  }

  if (result.kind === "missing") {
    return new Response("Event not found.", { status: 404 });
  }

  return new Response(buildIcs(result.event), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${result.event.slug}.ics"`,
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
    },
  });
}
