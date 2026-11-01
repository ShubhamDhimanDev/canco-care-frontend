import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "white";

const base =
  "inline-flex items-center justify-center gap-5 rounded-[12px] border-2 px-[23px] py-[13px] text-base font-medium tracking-[1.6px] uppercase transition-all duration-300 ease-in-out";

const variants: Record<ButtonVariant, string> = {
  // Slate; turns orange (with an orange border) on hover.
  primary:
    "border-transparent bg-brand-slate text-white hover:border-cta hover:bg-cta",
  // Orange; turns slate on hover.
  secondary: "border-transparent bg-cta text-white hover:bg-brand-slate",
  // White outline on a slate background.
  outline:
    "border-white bg-transparent text-white hover:bg-white hover:text-brand-navy",
  // White fill on a slate background.
  white:
    "border-white bg-white text-brand-navy hover:bg-transparent hover:text-white",
};

type Common = { variant?: ButtonVariant; className?: string };

type AsLink = Common & { href: string } & Omit<
    ComponentProps<typeof Link>,
    "href" | "className"
  >;
type AsButton = Common & { href?: undefined } & ComponentProps<"button">;

/** A link when given an `href`, otherwise a real <button>. */
export function Button(props: AsLink | AsButton) {
  const { variant = "primary", className } = props;
  const classes = cn(base, variants[variant], className);

  if (props.href !== undefined) {
    const { variant: _variant, className: _className, href, ...rest } = props;
    void _variant;
    void _className;

    return /^(https?:|mailto:|tel:)/.test(href) ? (
      <a
        href={href}
        className={classes}
        {...(rest as ComponentProps<"a">)}
      />
    ) : (
      <Link href={href} className={classes} {...rest} />
    );
  }

  const { variant: _variant, className: _className, type, ...rest } = props;
  void _variant;
  void _className;

  return <button type={type ?? "button"} className={classes} {...rest} />;
}
