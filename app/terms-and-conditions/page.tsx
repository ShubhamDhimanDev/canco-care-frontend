import type { Metadata } from "next";

import { LegalPage } from "@/components/sections/legal-page";
import { getPage, pageText } from "@/lib/api/pages";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPage("terms-and-conditions");

  return {
    title: pageText(content, "meta_title"),
    description: pageText(content, "meta_description"),
    alternates: { canonical: "/terms-and-conditions" },
  };
}

export default async function TermsPage() {
  return <LegalPage content={await getPage("terms-and-conditions")} />;
}
