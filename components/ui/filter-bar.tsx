import Link from "next/link";

import { Button } from "@/components/ui/button";

type Option = { value: string; label: string };

type Props = {
  /** The page the form submits to (a plain GET, so it works without JavaScript). */
  action: string;
  /** Accessible name of the whole search, e.g. "Search stories". */
  label: string;
  placeholder: string;
  query: string;
  /** An optional drop-down next to the search box. */
  select?: {
    name: string;
    label: string;
    value: string;
    options: Option[];
  };
  /** Shown when something is filtered: where "Clear" leads. */
  clearHref?: string;
};

const CONTROL =
  "h-[50px] rounded-[12px] border-2 border-transparent bg-white px-4 text-[16px] font-medium text-ink shadow-card outline-none placeholder:text-ink/60 focus-visible:border-brand-navy";

/**
 * A search box with an optional drop-down, for the stories and events lists. One row on a wide screen,
 * stacked on a phone. It is a plain GET form: no script needed, and every result has its own address.
 */
export function FilterBar({
  action,
  label,
  placeholder,
  query,
  select,
  clearHref,
}: Props) {
  return (
    <form
      action={action}
      method="get"
      role="search"
      aria-label={label}
      className="mx-auto mb-[60px] flex max-w-[860px] flex-wrap items-center justify-center gap-3 phone:flex-col phone:items-stretch"
    >
      <div className="relative min-w-0 flex-1 basis-[260px] phone:basis-auto">
        <label htmlFor={`${action}-q`} className="sr-only">
          {label}
        </label>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-brand-slate"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id={`${action}-q`}
          type="search"
          name="q"
          defaultValue={query}
          maxLength={80}
          placeholder={placeholder}
          autoComplete="off"
          className={`${CONTROL} w-full pl-12`}
        />
      </div>

      {select && (
        <div>
          <label htmlFor={`${action}-${select.name}`} className="sr-only">
            {select.label}
          </label>
          <select
            id={`${action}-${select.name}`}
            name={select.name}
            defaultValue={select.value}
            className={`${CONTROL} w-full min-w-[170px] cursor-pointer`}
          >
            {select.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <Button type="submit" className="h-[50px] py-0">
        Search
      </Button>

      {clearHref && (
        <Link
          href={clearHref}
          className="px-2 text-[16px] phone:text-center font-semibold text-brand-slate-dark underline underline-offset-4 hover:text-brand-navy"
        >
          Clear
        </Link>
      )}
    </form>
  );
}
