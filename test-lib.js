import {
  validateLanguageTag,
  isWellFormed,
  isValid,
  parseTag,
} from "./dist/index.js";

// Test valid language tags
const validTags = [
  "en", // English
  "en-US", // English (United States)
  "zh-Hans-CN", // Chinese (Simplified, China)
  "de-DE-1996", // German (Germany, orthography of 1996)
  "sl-rozaj", // Slovenian, Resian dialect
  "es-419", // Spanish (Latin America)
  "fr-CA", // French (Canada)
  "i-klingon", // Klingon (grandfathered)
  "en-GB-oed", // English, Oxford English Dictionary spelling (grandfathered)
  "art-lojban", // Lojban (grandfathered)
  "zh-min-nan", // Min Nan Chinese (grandfathered)
  "x-private", // Private use only
  "en-x-custom", // English with private use subtag
  "de-CH-1901-x-gsg", // German (Switzerland, traditional orthography) with private use
];

// Test invalid language tags
const invalidTags = [
  "", // Empty string
  "e", // Too short language code
  "en-", // Trailing hyphen
  "-en", // Leading hyphen
  "en--US", // Double hyphen
  "en-US-", // Trailing hyphen
  "abcdefghi", // Too long language code
  "en-Latn-Latn", // Duplicate script
  "en-US-US", // Duplicate region
  "en-variant-variant", // Duplicate variant
  "en-a-abc-a-def", // Duplicate singleton
  "en-a", // Singleton with no subtag
  "123", // Numeric language
  "en-US-123!@#", // Invalid characters
];

// Test all valid tags
console.log("=== Testing Valid Tags ===");
validTags.forEach((tag) => {
  const result = validateLanguageTag(tag);
  console.log(
    `${tag}: isWellFormed=${result.isWellFormed}, isValid=${result.isValid}`
  );

  // Show the parsed structure for a few examples
  if (["en-US", "zh-Hans-CN", "de-CH-1901-x-gsg"].includes(tag)) {
    console.log("  Parsed:", JSON.stringify(result.tag, null, 2));
  }
});

// Test all invalid tags
console.log("\n=== Testing Invalid Tags ===");
invalidTags.forEach((tag) => {
  const result = validateLanguageTag(tag);
  console.log(
    `${tag || '""'}: isWellFormed=${result.isWellFormed}, isValid=${
      result.isValid
    }`
  );

  // Show the errors for a few examples
  if (["en-", "en--US", "en-a"].includes(tag)) {
    console.log("  Errors:", JSON.stringify(result.errors, null, 2));
  }
});

// Test the convenience functions
console.log("\n=== Testing Convenience Functions ===");
console.log('isWellFormed("en-US"):', isWellFormed("en-US"));
console.log('isWellFormed("en--US"):', isWellFormed("en--US"));
console.log('isValid("en-US"):', isValid("en-US"));
console.log('isValid("en--US"):', isValid("en--US"));

// Test the parsing function
console.log("\n=== Testing Parse Function ===");
const parsed = parseTag("en-US-x-custom");
console.log('parseTag("en-US-x-custom"):', JSON.stringify(parsed, null, 2));
