/** One value of a query-string parameter (the first, if it was repeated), trimmed and cut to `max` characters. */
export function param(value: string | string[] | undefined, max = 80): string {
  const raw = Array.isArray(value) ? value[0] : value;

  return (raw ?? "").trim().slice(0, max);
}

/** `?page=` as a whole number of at least 1. */
export function pageParam(value: string | string[] | undefined): number {
  return Math.max(1, Number.parseInt(param(value, 6) || "1", 10) || 1);
}

/** "/stories?q=coat&page=2" from a path and its non-empty parameters; "/stories" when there are none. */
export function withParams(
  path: string,
  params: Record<string, string | number | undefined>,
): string {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "" && value !== 1) {
      query.set(key, String(value));
    }
  }

  const text = query.toString();

  return text ? `${path}?${text}` : path;
}
