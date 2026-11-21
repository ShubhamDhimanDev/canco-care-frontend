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

  // "H", the heart and "PE" are separate inline pieces, so without this the browser may break the line
  // between them and split the word (seen on phones). The rest of the title can still wrap.
  return (
    <>
      {upper.slice(0, at)}
      <span className="whitespace-nowrap">
        H<HeartO />
        {upper.slice(at + 2, at + 4)}
      </span>
      {upper.slice(at + 4)}
    </>
  );
}
