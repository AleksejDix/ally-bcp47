/**
 * A TypeScript package for working with BCP-47 language tags
 */

/**
 * Validates if a string is a valid BCP-47 language tag
 *
 * @param tag The language tag to validate
 * @returns Boolean indicating if the tag is valid
 */
export function isValidLanguageTag(tag: string): boolean {
  // This is a simplified validation - a complete implementation would be more complex
  const bcp47Regex =
    /^[a-z]{2,3}(-[A-Z][a-z]{3})?(-[A-Z]{2}|-[0-9]{3})?(-[A-Z0-9]{5,8})?(-[a-z0-9]{1,8})*$/;
  return bcp47Regex.test(tag);
}

/**
 * Parses a BCP-47 language tag into its components
 *
 * @param tag The language tag to parse
 * @returns An object containing the tag components
 */
export function parseLanguageTag(tag: string): {
  language?: string;
  script?: string;
  region?: string;
  variant?: string[];
  extension?: string[];
} {
  if (!isValidLanguageTag(tag)) {
    throw new Error(`Invalid BCP-47 language tag: ${tag}`);
  }

  const parts = tag.split("-");
  const result: ReturnType<typeof parseLanguageTag> = {};

  // Basic parsing logic (simplified)
  if (parts.length > 0) {
    result.language = parts[0];
  }

  // Add more comprehensive parsing logic as needed

  return result;
}

/**
 * Gets the display name of a language tag in a specific locale
 *
 * @param tag The language tag
 * @param displayLocale The locale to display the name in (defaults to 'en')
 * @returns The display name of the language
 */
export function getLanguageDisplayName(
  tag: string,
  displayLocale: string = "en"
): string {
  // In a real implementation, this would use Intl or a comprehensive language database
  // This is just a placeholder implementation
  return (
    new Intl.DisplayNames([displayLocale], { type: "language" }).of(tag) || tag
  );
}
