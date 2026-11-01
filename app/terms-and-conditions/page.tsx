import { readFile } from "node:fs/promises";
import path from "node:path";

import type { Metadata } from "next";
import { cacheLife } from "next/cache";

import { Container } from "@/components/ui/container";
import { Eyebrow, PageTitle } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "How Canco Cares and Canco Petroleum collect, use and protect personal information, including donor information.",
  alternates: { canonical: "/terms-and-conditions" },
};

// INTERIM: this is the text published on the live site, extracted verbatim into content/. It is Canco
// Petroleum Ltd.'s privacy policy with donation clauses; legal review is still pending (Q-L1). Once the
// Laravel "Pages" module exists this will be fetched from GET /api/v1/pages/terms-and-conditions.
async function loadTerms(): Promise<string> {
  "use cache";
  cacheLife("max");

  return readFile(
    path.join(process.cwd(), "content", "terms-and-conditions.html"),
    "utf8",
  );
}

export default async function TermsPage() {
  const html = await loadTerms();

  return (
    <div className="pt-[250px] pb-[200px] tablet:pt-[173px] phone:pt-[128px]">
      <Container>
        <div className="mb-[60px] text-center phone:-mx-3 phone:mb-[9px]">
          <Eyebrow className="phone:text-[22px]">CANCO CARES</Eyebrow>
          <PageTitle className="phone:text-[22px] phone:leading-[26.4px] phone:tracking-[1.3px]">
            TERMS AND CONDITIONS
          </PageTitle>
        </div>

        <div
          className="legal flow-root -mx-3 rounded-[16px] bg-white p-[47px] shadow-card phone:bg-transparent phone:p-0 phone:shadow-none"
          // First-party content from our own repository (see above), not user input.
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Container>
    </div>
  );
}
