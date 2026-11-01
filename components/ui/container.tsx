import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Centred page column. Max widths and the 12 px gutter are Bootstrap's (the legacy site's grid),
 * which gives the same 1296 px content width at a 1440 px screen.
 */
export function Container({
  as: Tag = "div",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-3 phone:px-[42px] sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
