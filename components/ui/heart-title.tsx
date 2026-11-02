import { HeartO } from "@/components/ui/heart-o";

/**
 * Uppercases a headline and puts the orange heart where the "O" of "HOPE" would be (the brand
 * mark). A title without that word is just uppercased. Pair it with a visually hidden plain copy
 * of the title, so assistive technology reads the real words.
 */
export function HeartTitle({ title }: { title: string }) {
  const upper = title.toUpperCase();
  const at = upper.indexOf("HOPE");

  if (at === -1) {
    return <>{upper}</>;
  }

  return (
    <>
      {upper.slice(0, at)}H<HeartO />
      {upper.slice(at + 2)}
    </>
  );
}
