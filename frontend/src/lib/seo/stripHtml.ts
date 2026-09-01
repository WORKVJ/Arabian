/**
 * Strip HTML tags from a string and normalize whitespace.
 * Used to produce clean plain-text meta descriptions from API content
 * that may contain HTML or rich-text fragments.
 */
export function stripHtml(input: string | null | undefined, maxLength = 160): string {
  if (!input) return '';
  // Remove HTML tags
  const stripped = input.replace(/<[^>]*>/g, ' ');
  // Normalize whitespace (collapse multiple spaces/newlines)
  const normalized = stripped.replace(/\s+/g, ' ').trim();
  // Truncate cleanly at a word boundary
  if (normalized.length <= maxLength) return normalized;
  const truncated = normalized.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;
}
