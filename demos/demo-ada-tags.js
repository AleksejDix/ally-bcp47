/**
 * BCP-47 Language Tag Validation Library
 * Demo script for ADA (Americans with Disabilities Act) compliance
 *
 * This script demonstrates how to validate and work with BCP-47 language tags
 * in the context of ADA compliance for web accessibility.
 */

import { validateLanguageTag} from "./dist/index.js";

// Demo header
console.log("==========================================================");
console.log("BCP-47 Language Tag Validation for ADA Compliance");
console.log("==========================================================\n");

// Basic US language tags
console.log("Basic US language tags:");
const basicUsTags = ["en-US", "es-US", "zh-Hans-US", "tl-US"];

basicUsTags.forEach((tag) => {
  const result = validateLanguageTag(tag);
  console.log(`\n${tag}:`);
  console.log(`  Valid: ${result.isValid}`);
  if (result.tag) {
    console.log(`  Canonical form: ${result.tag.tag}`);
    console.log(`  Components: ${JSON.stringify(result.tag, null, 2)}`);
  }
});

// Accessibility extensions for ADA compliance
console.log("\n\n==========================================================");
console.log("Accessibility extensions for ADA compliance:");
console.log("==========================================================\n");

const accessibilityTags = [
  "en-US-u-hc-h12", // 12-hour clock format (AM/PM)
  "en-US-u-ca-gregory", // Gregorian calendar explicitly set
  "en-US-u-nu-latn", // Latin numerals
  "en-US-u-ms-ussystem", // US measurement system
  "en-US-u-fw-sun", // Week starts on Sunday
];

accessibilityTags.forEach((tag) => {
  const result = validateLanguageTag(tag);
  console.log(`\n${tag}:`);
  console.log(`  Valid: ${result.isValid}`);

  if (result.tag && result.tag.extensions) {
    console.log("  Extensions:");
    for (const [singleton, values] of Object.entries(result.tag.extensions)) {
      console.log(`    ${singleton}: ${values.join(", ")}`);
    }
  }
});

// Private use tags for screen readers and accessibility
console.log("\n\n==========================================================");
console.log("Private use extensions for screen readers and accessibility:");
console.log("==========================================================\n");

const privateUseTags = [
  "en-US-x-sr", // For screen reader output
  "en-US-x-hc", // For high contrast display
  "en-US-x-sim", // For simplified language
  "en-US-x-lp", // For large print output
];

privateUseTags.forEach((tag) => {
  const result = validateLanguageTag(tag);
  console.log(`\n${tag}:`);
  console.log(`  Valid: ${result.isValid}`);

  if (result.tag && result.tag.privateuse) {
    console.log("  Private use subtags:");
    console.log(`    ${result.tag.privateuse.join(", ")}`);
  }
});

// Common ADA compliance mistakes to avoid
console.log("\n\n==========================================================");
console.log("Common ADA compliance mistakes to avoid:");
console.log("==========================================================\n");

const commonMistakes = [
  {
    tag: "english",
    correct: "en-US",
    issue: "Using full language name instead of ISO code",
  },
  {
    tag: "eng",
    correct: "en",
    issue: "Using 3-letter ISO 639-2 code instead of 2-letter ISO 639-1 code",
  },
  {
    tag: "en-USA",
    correct: "en-US",
    issue: "Using country name abbreviation instead of ISO code",
  },
  { tag: "en-", correct: "en", issue: "Empty subtag" },
];

commonMistakes.forEach(({ tag, correct, issue }) => {
  const result = validateLanguageTag(tag);
  console.log(`\n${tag}:`);
  console.log(`  Is valid: ${result.isValid}`);
  console.log(`  Issue: ${issue}`);
  console.log(`  Correct tag: ${correct}`);
  if (result.errors) {
    console.log("  Errors:");
    result.errors.forEach((error) => {
      console.log(`    - ${error.message}`);
      if (error.suggestedReplacement) {
        console.log(
          `      Suggested replacement: ${error.suggestedReplacement}`
        );
      }
    });
  }
});

// Canonical form demonstration
console.log("\n\n==========================================================");
console.log("Canonical form demonstration for US language tags:");
console.log("==========================================================\n");

const caseVariations = ["EN-us", "en-US", "zH-hAns-Us", "ES-us"];

caseVariations.forEach((tag) => {
  const result = validateLanguageTag(tag);
  const canonical = result.tag?.tag || "Invalid tag";
  console.log(`${tag} → ${canonical}`);
});

console.log("\n==========================================================");
console.log("End of ADA compliance demonstration");
console.log("==========================================================");
