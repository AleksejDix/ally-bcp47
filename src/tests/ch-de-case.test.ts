import { describe, it, expect } from "vitest";
import {
  validateLanguageTag,
  ValidationErrorType,
} from "../index";

/**
 * Specific Test Case for ch-DE
 *
 * This file contains extensive testing for the ch-DE language tag,
 * which is a common mistake that might be made when trying to represent
 * Swiss German or Chinese in Germany.
 */
describe("ch-DE Case Study", () => {
  describe("Syntactic vs. Registry Validation", () => {
    it("should identify ch-DE as syntactically valid but semantically incorrect", () => {
      const result = validateLanguageTag("ch-DE");

      // In our current implementation, ch-DE passes syntax validation
      expect(result.isWellFormed).toBe(true);
      expect(result.isValid).toBe(false);

      // The tag should be correctly parsed
      expect(result.tag).toMatchObject({
        tag: "ch-DE",
        language: "ch",
        region: "de",
      });

      // There should be an unknown language error
      expect(
        result.errors?.some(
          (e) =>
            e.type === ValidationErrorType.UNKNOWN_SUBTAG &&
            e.subtagType === "language"
        )
      ).toBe(true);

      // Should have a suggested replacement
      expect(result.errors?.some((e) => e.suggestedReplacement === "zh")).toBe(
        true
      );
    });
  });

  describe("Correct Alternatives for ch-DE", () => {
    it("should validate the correct alternatives for Swiss German in Germany", () => {
      const gswDeResult = validateLanguageTag("gsw-DE");

      expect(gswDeResult.isWellFormed).toBe(true);
      expect(gswDeResult.isValid).toBe(true);

      // Parsed tag should show the correct structure
      expect(gswDeResult.tag).toMatchObject({
        tag: "gsw-DE",
        language: "gsw",
        region: "de",
      });
    });

    it("should validate the correct alternatives for Chinese in Germany", () => {
      const zhDeResult = validateLanguageTag("zh-DE");

      expect(zhDeResult.isWellFormed).toBe(true);
      expect(zhDeResult.isValid).toBe(true);

      // Parsed tag should show the correct structure
      expect(zhDeResult.tag).toMatchObject({
        tag: "zh-DE",
        language: "zh",
        region: "de",
      });
    });
  });

  describe("Common Misuses", () => {
    it("should identify other common country-as-language mistakes", () => {
      const commonMistakes = [
        "ch-FR", // Switzerland (country code) + France
        "uk-DE", // United Kingdom (country code) + Germany
        "us-ES", // United States (country code) + Spain
        "fr-FR-fr", // French + France + French (duplicate)
      ];

      commonMistakes.forEach((tag) => {
        const result = validateLanguageTag(tag);

        // Some should pass syntax checks but would fail registry validation
        if (tag === "ch-FR" || tag === "uk-DE" || tag === "us-ES") {
          // These pass syntax validation in our current implementation
          expect(result.isWellFormed).toBe(true);
        }

        if (tag === "fr-FR-fr") {
          // This should fail syntax validation because the variant is not valid
          expect(result.isWellFormed).toBe(false);
        }
      });
    });
  });

  describe("EAA Compliance Considerations", () => {
    it("should properly validate the correct EAA-compliant alternatives to ch-DE", () => {
      // German in Switzerland (correct, not ch-DE)
      const deChResult = validateLanguageTag("de-CH");
      expect(deChResult.isWellFormed).toBe(true);
      expect(deChResult.isValid).toBe(true);

      // Swiss German - the correct language code
      const gswResult = validateLanguageTag("gsw");
      expect(gswResult.isWellFormed).toBe(true);
      expect(gswResult.isValid).toBe(true);

      // Swiss German in Switzerland
      const gswChResult = validateLanguageTag("gsw-CH");
      expect(gswChResult.isWellFormed).toBe(true);
      expect(gswChResult.isValid).toBe(true);
    });

    it("should handle ch-DE with extensions", () => {
      // Testing with extensions to ensure our parser handles these cases
      const result = validateLanguageTag("ch-DE-u-co-phonebk");
      expect(result.isWellFormed).toBe(true);
      expect(result.tag?.extensions?.u).toEqual(["co", "phonebk"]);
    });
  });
});
