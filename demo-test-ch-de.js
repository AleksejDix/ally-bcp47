import {
  validateLanguageTag,
  isWellFormed,
  isValid,
  parseTag,
} from "./dist/index.js";

// Test the ch-DE tag specifically
console.log("=== Testing ch-DE Language Tag ===");

// Validate the tag
const result = validateLanguageTag("ch-DE");
console.log("Validation result for ch-DE:", {
  isWellFormed: result.isWellFormed,
  isValid: result.isValid,
});

// Parse the tag
console.log("Parsed tag:", JSON.stringify(result.tag, null, 2));

// Test with convenience functions
console.log("isWellFormed('ch-DE'):", isWellFormed("ch-DE"));
console.log("isValid('ch-DE'):", isValid("ch-DE"));

// Demonstrate what happens when registry validation is added:
console.log("\n=== With Registry Validation (Hypothetical) ===");
console.log(
  "In a complete implementation with registry validation, 'ch-DE' would be invalid because 'ch' is not a valid ISO 639 language code"
);
console.log(
  "It should produce an error like: 'Unknown language subtag: ch. Did you mean 'zh' (Chinese)?'"
);

console.log("\n=== Explanation ===");
console.log(
  "'ch-DE' passes syntax validation but would fail registry validation in a complete implementation."
);
console.log(
  "'ch' is not a valid ISO 639 language code. It might be a typo for 'zh' (Chinese) or intended to represent Swiss German, which should be 'gsw-CH'."
);
