import { describe, it, expect } from "vitest";
import {
  validateLanguageTag,
  isValid,
  canonicalizeTag,
  ValidationErrorType,
} from "../index";

describe("Registry Validation and Normalization", () => {
  describe("Registry Validation", () => {
    it("should validate valid language codes", () => {
      const validLanguages = ["en", "de", "fr", "zh", "ja", "ru", "gsw"];

      validLanguages.forEach((lang) => {
        const result = validateLanguageTag(lang, { checkRegistry: true });
        expect(result.isValid, `${lang} should be valid`).toBe(true);
      });
    });

    it("should reject invalid language codes", () => {
      const invalidLanguages = ["xx", "zzz", "qq", "ch"];
      const numericLanguages = ["123"];

      invalidLanguages.forEach((lang) => {
        const result = validateLanguageTag(lang, { checkRegistry: true });
        expect(result.isValid, `${lang} should be invalid`).toBe(false);
        expect(result.errors).toBeDefined();
        expect(
          result.errors?.some(
            (e) => e.type === ValidationErrorType.UNKNOWN_SUBTAG
          ),
          `${lang} should have UNKNOWN_SUBTAG error`
        ).toBe(true);
      });

      // Numeric codes should be rejected with syntax error
      numericLanguages.forEach((lang) => {
        const result = validateLanguageTag(lang, { checkRegistry: true });
        expect(result.isValid, `${lang} should be invalid`).toBe(false);
        expect(result.errors).toBeDefined();
      });
    });

    it("should validate valid region codes", () => {
      const validRegions = [
        "en-US",
        "de-DE",
        "fr-FR",
        "zh-CN",
        "ja-JP",
        "ru-RU",
      ];

      validRegions.forEach((tag) => {
        const result = validateLanguageTag(tag, { checkRegistry: true });
        expect(result.isValid, `${tag} should be valid`).toBe(true);
      });
    });

    it("should reject invalid region codes", () => {
      const invalidRegions = ["en-XX", "de-YY", "fr-ZZZ", "en-EU"];

      invalidRegions.forEach((tag) => {
        const result = validateLanguageTag(tag, { checkRegistry: true });
        expect(result.isValid, `${tag} should be invalid`).toBe(false);
        expect(result.errors).toBeDefined();
        expect(
          result.errors?.some(
            (e) => e.type === ValidationErrorType.UNKNOWN_SUBTAG
          )
        ).toBe(true);
      });
    });

    it("should validate valid script codes", () => {
      const validScripts = ["zh-Hans", "zh-Hant", "sr-Cyrl", "sr-Latn"];

      validScripts.forEach((tag) => {
        const result = validateLanguageTag(tag, { checkRegistry: true });
        expect(result.isValid, `${tag} should be valid`).toBe(true);
      });
    });

    it("should reject invalid script codes", () => {
      const invalidScripts = ["zh-Wxyz", "sr-Abcd", "en-Xyzt"];

      invalidScripts.forEach((tag) => {
        const result = validateLanguageTag(tag, { checkRegistry: true });
        expect(result.isValid, `${tag} should be invalid`).toBe(false);
        expect(result.errors).toBeDefined();
        expect(
          result.errors?.some(
            (e) => e.type === ValidationErrorType.UNKNOWN_SUBTAG
          )
        ).toBe(true);
      });
    });

    it("should include suggested replacements", () => {
      const tagsWithSuggestions = [
        { tag: "ch-DE", suggestion: "zh" }, // ch (Switzerland) -> zh (Chinese)
        { tag: "en-UK", suggestion: "GB" }, // UK -> GB
      ];

      tagsWithSuggestions.forEach(({ tag, suggestion }) => {
        const result = validateLanguageTag(tag, { checkRegistry: true });
        expect(result.isValid).toBe(false);

        const relevantError = result.errors?.find(
          (e) =>
            e.type === ValidationErrorType.UNKNOWN_SUBTAG &&
            e.suggestedReplacement !== undefined
        );

        expect(relevantError).toBeDefined();
        expect(relevantError?.suggestedReplacement).toBe(suggestion);
      });
    });
  });

  describe("Tag Normalization", () => {
    it("should normalize case according to BCP-47 standards", () => {
      const testCases = [
        { input: "en-us", expected: "en-US" },
        { input: "EN-US", expected: "en-US" },
        { input: "zh-hans-cn", expected: "zh-Hans-CN" },
        { input: "ZH-HANS-CN", expected: "zh-Hans-CN" },
        { input: "sr-CYRL-rs", expected: "sr-Cyrl-RS" },
        { input: "de-DE-u-co-phonebk", expected: "de-DE-u-co-phonebk" },
        { input: "EN-GB-u-CA-gregory", expected: "en-GB-u-ca-gregory" },
        { input: "fr-ca-x-PRIVATE", expected: "fr-CA-x-private" },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = canonicalizeTag(input);
        expect(result).toBe(expected);
      });
    });

    it("should handle invalid tags", () => {
      const invalidTags = ["", "x-", "en-", "-en", "en--us"];

      invalidTags.forEach((tag) => {
        const result = canonicalizeTag(tag);
        expect(result).toBeNull();
      });
    });

    it("should normalize tags used in parser result", () => {
      const testCases = [
        { input: "en-us", expected: "en-US" },
        { input: "zh-hans-cn", expected: "zh-Hans-CN" },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = validateLanguageTag(input);
        expect(result.isWellFormed).toBe(true);
        expect(result.tag?.tag).toBe(expected);
      });
    });
  });
});
