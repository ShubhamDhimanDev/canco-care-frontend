import { cn } from "@/lib/utils";
import { SOCIAL } from "@/lib/site";

// Icon artwork from the live site (36×36, one colour so CSS decides the shade).
const ICONS = {
  facebook: (
    <path d="M26.6 0H9.4A9.409 9.409 0 0 0 0 9.4v17.2A9.409 9.409 0 0 0 9.4 36h5.338V23.307h-4.676v-5.431h4.673V13.117a6.6 6.6 0 0 1 6.6-6.6h4.6v5.2h-2.616a2.279 2.279 0 0 0-2.279 2.278v3.837h5.087l-.815 5.392h-4.272V36H26.6A9.409 9.409 0 0 0 36 26.6V9.4A9.409 9.409 0 0 0 26.6 0" />
  ),
  instagram: (
    <>
      <path d="M24.34 7.005H11.66a4.662 4.662 0 0 0-4.656 4.657V24.34a4.662 4.662 0 0 0 4.656 4.656H24.34a4.662 4.662 0 0 0 4.656-4.656V11.66a4.662 4.662 0 0 0-4.656-4.655M18 24.816a6.816 6.816 0 1 1 6.816-6.816A6.823 6.823 0 0 1 18 24.816m7.006-12.371a1.567 1.567 0 1 1 1.567-1.567 1.567 1.567 0 0 1-1.567 1.567" />
      <path d="M27.023 0H8.977A8.977 8.977 0 0 0 0 8.977v18.046A8.977 8.977 0 0 0 8.977 36h18.046A8.977 8.977 0 0 0 36 27.023V8.977A8.977 8.977 0 0 0 27.023 0m4.242 24.34a6.933 6.933 0 0 1-6.925 6.925H11.661a6.933 6.933 0 0 1-6.926-6.925V11.66a6.934 6.934 0 0 1 6.926-6.926H24.34a6.933 6.933 0 0 1 6.925 6.926Z" />
      <path d="M18 13.453a4.547 4.547 0 1 0 4.547 4.547A4.552 4.552 0 0 0 18 13.453" />
    </>
  ),
  linkedin: (
    <path d="M26.6 0H9.4A9.409 9.409 0 0 0 0 9.4v17.2A9.409 9.409 0 0 0 9.4 36h17.2a9.409 9.409 0 0 0 9.4-9.4V9.4A9.409 9.409 0 0 0 26.6 0M11.3 29.853H6.56V14.226H11.3ZM8.928 11.663A2.759 2.759 0 1 1 11.687 8.9a2.759 2.759 0 0 1-2.759 2.763m20.9 18.191H25.1v-8.123c0-2.383-.955-4.067-2.494-4.067-2.668 0-3.437 1.7-3.437 5.24v6.949h-4.741V19.075c0-1.646 0-3.638-.038-5.08h4.591a19.107 19.107 0 0 1 .183 2.289c.688-1.34 2.169-2.751 5.644-2.751 3.789 0 5.023 2.737 5.023 7.657Z" />
  ),
} as const;

const LABELS = {
  facebook: "Canco Cares on Facebook",
  instagram: "Canco Cares on Instagram",
  linkedin: "Canco Cares on LinkedIn",
} as const;

export function SocialLinks({
  tone,
  className,
  iconClassName,
}: {
  /** "header": slate on the page background. "footer": white on the slate footer. */
  tone: "header" | "footer";
  className?: string;
  iconClassName?: string;
}) {
  return (
    <ul className={cn("m-0 flex list-none items-center p-0", className)}>
      {(Object.keys(ICONS) as (keyof typeof ICONS)[]).map((key) => (
        <li key={key}>
          <a
            href={SOCIAL[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${LABELS[key]} (opens in a new tab)`}
            className={cn(
              "block transition-colors duration-200",
              tone === "header"
                ? "text-brand-slate/40 hover:text-brand-slate"
                : "text-white/50 hover:text-white",
            )}
          >
            <svg
              viewBox="0 0 36 36"
              fill="currentColor"
              aria-hidden="true"
              className={cn("size-9", iconClassName)}
            >
              {ICONS[key]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
