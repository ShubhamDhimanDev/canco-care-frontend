import Image from "next/image";

/**
 * The hand-drawn orange heart that stands in for the "O" in "HOPE". Purely decorative:
 * the heading that contains it carries the real word for assistive technology.
 */
export function HeartO({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/images/bigHeartIcon.webp"
      alt=""
      width={595}
      height={509}
      aria-hidden="true"
      className={`mx-[0.04em] inline-block h-[0.95em] w-auto align-[-0.12em] ${className}`}
    />
  );
}
