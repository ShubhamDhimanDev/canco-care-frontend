import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = {
  as?: ElementType;
  id?: string;
  className?: string;
  children: ReactNode;
};

/**
 * The small slate line above or below a title ("Every community deserves", "Our", "WITH US").
 * The live site marked these up as <h4> before the <h1>, which breaks heading order; we use a
 * paragraph with the same look.
 */
export function Eyebrow({ as: Tag = "p", id, className, children }: Props) {
  return (
    <Tag
      id={id}
      className={cn(
        "m-0 mb-2 text-[25px] leading-8 font-semibold text-brand-slate phone:text-[20px]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** The page's single <h1>: 54/64.8, wide tracking, navy. */
export function PageTitle({ as: Tag = "h1", id, className, children }: Props) {
  return (
    <Tag
      id={id}
      className={cn(
        "m-0 text-[54px] leading-[64.8px] font-bold tracking-[4.5px] text-brand-navy phone:text-[40px] phone:leading-[48px]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * Big section title ("PROJECTS", "MISSION", "VALUES"). Steps down to 35 px below 1300 px;
 * long words ("PARTNERSHIPS") step down again to 30 px on tablet and phone.
 * `fixed` titles (the impact figure, "LATEST STORIES") keep the full 54 px at every width.
 */
export function SectionTitle({
  as: Tag = "h2",
  id,
  className,
  children,
  long = false,
  fixed = false,
}: Props & { long?: boolean; fixed?: boolean }) {
  return (
    <Tag
      id={id}
      className={cn(
        "m-0 text-[54px] leading-[64.8px] font-bold tracking-[4.5px] text-brand-navy",
        !fixed &&
          "max-[1300px]:text-[35px] max-[1300px]:leading-[42px] max-[1300px]:tracking-[1.8px]",
        long && "tablet:text-[30px] tablet:leading-[36px]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Body copy: 18/32, medium weight. */
export function Lead({ as: Tag = "p", id, className, children }: Props) {
  return (
    <Tag
      id={id}
      className={cn(
        "m-0 text-[18px] leading-8 font-medium text-ink",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
