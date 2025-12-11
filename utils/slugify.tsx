export function slugify(text?: string): string {
  return text
    ? text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-")
    : "";
}