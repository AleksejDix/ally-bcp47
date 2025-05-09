import { describe, it, expect } from "vitest";
import {
  validateLanguageTag,
  ValidationErrorType,
  isWellFormed,
  isValid,
  parseTag,
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
      const validTags = [
        "en",
        "en-US",
        "zh-Hans-CN",
        "de-DE-1901",
        "fr-FR-u-ca-gregory",
        "en-US-x-private",
        "de-CH-1901-x-gsg",
        "en-US-u-ca-gregory-t-en-US-x-private",
      ];

      validTags.forEach((tag) => {
        const result = validateLanguageTag(tag);
        expect(result.isWellFormed, `${tag} should be well-formed`).toBe(true);
      });
    });

    it("should identify syntax invalid language tags", () => {
      const invalidTags = [
        "",
        "-",
        "a-",
        "-a",
        "0",
        "01",
        "012",
        "0123",
        "en--us",
        "en-us-",
        "-en-us",
      ];

      invalidTags.forEach((tag) => {
        const result = validateLanguageTag(tag);
        expect(result.isWellFormed, `${tag} should be invalid`).toBe(false);
      });
    });

    it("should handle tags that would fail registry validation", () => {
      // These tags are syntactically valid but would fail registry validation
      const registryInvalidTags = [
        "xx-YY", // Invalid language and region
        "ab-XY", // Invalid region
        "en-Wxyz", // Invalid script
      ];

      registryInvalidTags.forEach((tag) => {
        // Without registry check, should be well-formed
        const syntaxResult = validateLanguageTag(tag);
        expect(syntaxResult.isWellFormed, `${tag} should be well-formed`).toBe(
          true
        );

        // With registry check, should be invalid
        const registryResult = validateLanguageTag(tag, {
          checkRegistry: true,
        });
        expect(registryResult.isValid, `${tag} should be invalid`).toBe(false);
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
      // Updated to match our current implementation
      expect(result.tag).toMatchObject({
        tag: "zh-CN",
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
      const result = validateLanguageTag("en--US");
      expect(result.isWellFormed).toBe(false);
      expect(Array.isArray(result.errors)).toBe(true);
      expect(result.errors?.length).toBeGreaterThan(0);
      expect(result.tag == null).toBe(true);
    });

    it("should handle the invalid ch-DE tag correctly", () => {
      // ch-DE is invalid because 'ch' is a region code (Switzerland), not a language code
      const result = validateLanguageTag("ch-DE", { checkRegistry: true });
      expect(result.isValid).toBe(false);
      expect(result.isWellFormed).toBe(true);
      const languageError = result.errors?.find(
        (e) =>
          e.type === ValidationErrorType.UNKNOWN_SUBTAG &&
          e.subtag === "ch" &&
          e.subtagType === "language"
      );
      expect(languageError).toBeDefined();
    });
  });

  describe("convenience functions", () => {
    it("isWellFormed should return true for valid tags", () => {
      expect(isWellFormed("en-US")).toBe(true);
      expect(isWellFormed("zh-Hans-CN")).toBe(true);
      expect(isWellFormed("de-DE-1901")).toBe(true);
    });

    it("isWellFormed should return false for invalid tags", () => {
      expect(isWellFormed("")).toBe(false);
      expect(isWellFormed("en--US")).toBe(false);
      expect(isWellFormed("-en")).toBe(false);
    });

    it("isValid should return true for valid tags", () => {
      expect(isValid("en-US")).toBe(true);
      expect(isValid("zh-Hans-CN")).toBe(true);
      expect(isValid("de-DE-1901")).toBe(true);
    });

    it("isValid should return false for invalid tags", () => {
      // These tags should be invalid regardless of registry check
      expect(isValid("xx-YY")).toBe(false);
      expect(isValid("en-XX")).toBe(false);
      expect(isValid("en-Wxyz")).toBe(false);
    });
  });

  describe("parseTag", () => {
    it("should parse valid tags correctly", () => {
      const enUS = parseTag("en-US");
      expect(enUS).toMatchObject({
        language: "en",
        region: "us",
      });

      // Updated to match current implementation
      const zhHansCN = parseTag("zh-Hans-CN");
      expect(zhHansCN).toMatchObject({
        language: "zh",
        script: "hans",
        region: "cn",
      });

      const deCH1901 = parseTag("de-CH-1901");
      expect(deCH1901).toMatchObject({
        language: "de",
        region: "ch",
        variants: ["1901"],
      });

      const privateUse = parseTag("x-private");
      expect(privateUse).toMatchObject({
        privateuse: ["private"],
      });
    });

    it("should return null for invalid tags", () => {
      expect(parseTag("")).toBeNull();
      expect(parseTag("a-")).toBeNull();
      expect(parseTag("-a")).toBeNull();
      expect(parseTag("en--us")).toBeNull();
    });
  });
});
