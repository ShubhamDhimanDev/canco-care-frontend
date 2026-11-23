import { Container } from "@/components/ui/container";
import { Eyebrow, PageTitle } from "@/components/ui/typography";
import { pageText } from "@/lib/api/pages";
import type { PageContent } from "@/lib/api/types";

/**
 * A long-text page (Terms and Conditions, Privacy Policy). The heading and the text are edited in the
 * admin ("Pages"); the text is sanitised on save by the Laravel app, so it is safe to render as HTML.
 */
export function LegalPage({ content }: { content: PageContent }) {
  const updatedOn = pageText(content, "updated_on");

  return (
    <div className="pt-[250px] pb-[200px] tablet:pt-[173px] phone:pt-[128px]">
      <Container>
        <div className="mb-[60px] text-center phone:-mx-3 phone:mb-[9px]">
          <Eyebrow className="phone:text-[22px]">
            {pageText(content, "eyebrow")}
          </Eyebrow>
          <PageTitle className="phone:text-[22px] phone:leading-[26.4px] phone:tracking-[1.3px]">
            {pageText(content, "title")}
          </PageTitle>
          {updatedOn && (
            <p className="mt-4 mb-0 text-[16px] leading-6 font-medium text-ink">
              Last updated: {updatedOn}
            </p>
          )}
        </div>

        <div
          className="legal flow-root -mx-3 rounded-[16px] bg-white p-[47px] shadow-card phone:bg-transparent phone:p-0 phone:shadow-none"
          // Sanitised by the Laravel app when an editor saves the page (HtmlSanitizer), not raw user input.
          dangerouslySetInnerHTML={{ __html: pageText(content, "body") }}
        />
      </Container>
    </div>
  );
}
