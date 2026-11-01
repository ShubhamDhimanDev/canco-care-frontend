import { extendTailwindMerge } from "tailwind-merge";

// By default tailwind-merge assumes a font-size utility also sets the line height (true for Tailwind's
// named sizes). We size text with arbitrary values (`text-[25px]`), which never touch line height, so
// an overriding size must not drop an explicit `leading-*`.
const twMerge = extendTailwindMerge({
  override: { conflictingClassGroups: { "font-size": [] } },
});

/** Joins class names, skipping anything falsy; later Tailwind utilities win over earlier conflicting ones. */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return twMerge(parts.filter(Boolean).join(" "));
}

/** "April 25, 2023" in Canadian English, always in UTC so the server and browser agree. */
export function formatDate(iso: string | null): string {
  if (!iso) {
    return "";
  }

  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(iso));
}
