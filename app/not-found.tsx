import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Eyebrow, Lead, PageTitle } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="pt-[250px] pb-[200px] phone:pt-[205px]">
      <Container>
        <div className="mx-auto max-w-[760px] text-center">
          <Eyebrow>Page not found</Eyebrow>
          <PageTitle>404</PageTitle>
          <Lead className="mt-[27px]">
            We couldn’t find the page you were looking for. It may have moved,
            or the address may have a typo.
          </Lead>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
            <Button href="/">Back to home</Button>
            <Button href="/stories">Read our stories</Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
