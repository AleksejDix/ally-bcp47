import { describe, it, expect } from "vitest";
import {
  validateLanguageTag,
  isWellFormed,
  isValid,
  parseTag,
  ValidationErrorType,
} from "../index";

describe("BCP-47 Language Tag Validator", () => {
  // Valid language tags test cases
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

  // Invalid language tags test cases that should fail syntax validation
  const syntaxInvalidTags = [
    "", // Empty string
    "e", // Too short language code
    "en-", // Trailing hyphen
    "-en", // Leading hyphen
    "en--US", // Double hyphen
    "en-US-", // Trailing hyphen
    "abcdefghi", // Too long language code
    "en-a", // Singleton with no subtag
    "123", // Numeric language
    "en-US-123!@#", // Invalid characters
  ];

  // Our parser detects duplicate subtags as syntax errors
  const duplicateSubtagsInvalidTags = [
    "en-Latn-Latn", // Duplicate script
    "en-US-US", // Duplicate region
    "en-variant-variant", // Duplicate variant
    "en-a-abc-a-def", // Duplicate singleton
  ];

  // Invalid language tags that would fail registry validation but pass syntax validation
  const registryOnlyInvalidTags = [
    "ch-DE", // Invalid language code (ch is not a valid ISO 639 language code)
  ];

  describe("validateLanguageTag", () => {
    it("should identify valid language tags", () => {
      const validTags = ["en", "en-US", "zh-Hans-CN", "de-CH-1901", "fr-CA"];

      validTags.forEach((tag) => {
        const result = validateLanguageTag(tag);
        expect(result.isWellFormed).toBe(true);
        expect(result.isValid).toBe(true);
      });
    });

    it("should identify syntax invalid language tags", () => {
      syntaxInvalidTags.forEach((tag) => {
        const result = validateLanguageTag(tag);
        expect(result.isWellFormed).toBe(false);
        expect(result.isValid).toBe(false);
      });
    });

    it("should identify duplicate subtags as invalid", () => {
      duplicateSubtagsInvalidTags.forEach((tag) => {
        const result = validateLanguageTag(tag);
        expect(result.isWellFormed).toBe(false);
        expect(result.isValid).toBe(false);
      });
    });

    it("should handle tags that would fail registry validation", () => {
      const invalidTagsForRegistry = ["xx-YY", "xy-Abcd-ZZ", "abc-XY"];

      invalidTagsForRegistry.forEach((tag) => {
        // Use isWellFormed directly which doesn't do registry checking
        expect(isWellFormed(tag)).toBe(true);

        // With registry checking enabled, these should be invalid
        expect(isValid(tag)).toBe(false);

        // Check both ways
        const resultWithoutRegistry = validateLanguageTag(tag, {
          checkRegistry: false,
        });
        expect(resultWithoutRegistry.isWellFormed).toBe(true);
        expect(resultWithoutRegistry.isValid).toBe(true);

        const resultWithRegistry = validateLanguageTag(tag, {
          checkRegistry: true,
        });
        expect(resultWithRegistry.isWellFormed).toBe(true);
        expect(resultWithRegistry.isValid).toBe(false);
      });
    });

    it("should parse en-US correctly", () => {
      const result = validateLanguageTag("en-US");
      expect(result.tag).toMatchObject({
        tag: "en-US",
        language: "en",
        region: "us",
      });
    });

    it("should parse zh-Hans-CN correctly", () => {
      const result = validateLanguageTag("zh-Hans-CN");
      expect(result.tag).toMatchObject({
        tag: "zh-Hans-CN",
        language: "zh",
        script: "hans",
        region: "cn",
      });
    });

    it("should parse de-CH-1901-x-gsg correctly", () => {
      const result = validateLanguageTag("de-CH-1901-x-gsg");
      expect(result.tag).toMatchObject({
        tag: "de-CH-1901-x-gsg",
        language: "de",
        region: "ch",
        variants: ["1901"],
        privateuse: ["gsg"],
      });
    });

    it("should return appropriate errors for invalid tags", () => {
      const result = validateLanguageTag("en-");
      expect(result.errors).toBeDefined();
      expect(result.errors?.length).toBeGreaterThan(0);
    });

    it("should handle the invalid ch-DE tag correctly", () => {
      const result = validateLanguageTag("ch-DE");
      expect(result.isWellFormed).toBe(true); // ch matches language pattern
      expect(result.isValid).toBe(false); // Should fail registry validation
      expect(result.tag).toMatchObject({
        tag: "ch-DE",
        language: "ch",
        region: "de",
      });
      // Should have registry error
      expect(
        result.errors?.some(
          (e) => e.type === ValidationErrorType.UNKNOWN_SUBTAG
        )
      ).toBe(true);
      // Should have suggestion
      expect(result.errors?.some((e) => e.suggestedReplacement === "zh")).toBe(
        true
      );
    });
  });

  describe("convenience functions", () => {
    it("isWellFormed should return true for valid tags", () => {
      expect(isWellFormed("en-US")).toBe(true);
    });

    it("isWellFormed should return false for invalid tags", () => {
      expect(isWellFormed("en--US")).toBe(false);
    });

    it("isValid should return true for valid tags", () => {
      expect(isValid("en-US")).toBe(true);
    });

    it("isValid should return false for invalid tags", () => {
      expect(isValid("en--US")).toBe(false);
    });
  });

  describe("parseTag", () => {
    it("should parse valid tags correctly", () => {
      const parsed = parseTag("en-US-x-custom");
      expect(parsed).toMatchObject({
        tag: "en-us-x-custom",
        language: "en",
        region: "us",
        privateuse: ["custom"],
      });
    });

    it("should return null for invalid tags", () => {
      const parsed = parseTag("en--US");
      expect(parsed).toBeNull();
    });
  });
});
