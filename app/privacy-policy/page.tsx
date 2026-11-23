import type { Metadata } from "next";

import { LegalPage } from "@/components/sections/legal-page";
import { getPage, pageText } from "@/lib/api/pages";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPage("privacy-policy");

  return {
    title: pageText(content, "meta_title"),
    description: pageText(content, "meta_description"),
    alternates: { canonical: "/privacy-policy" },
  };
}

export default async function PrivacyPolicyPage() {
  return <LegalPage content={await getPage("privacy-policy")} />;
}
