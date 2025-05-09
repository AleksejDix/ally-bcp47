import { describe, it, expect } from "vitest";
import { validateLanguageTag, isWellFormed, isValid, parseTag } from "../index";

/**
 * Section 508 Compliance Tests
 *
 * These tests specifically target the language tag validation requirements relevant
 * to Section 508 compliance for federal agencies and contractors in the United States.
 */
describe("Section 508 Compliance Tests", () => {
  // Official US government language tags
  const govLanguageTags = [
    { lang: "English (US)", tag: "en-US" },
    { lang: "Spanish (US)", tag: "es-US" },
    { lang: "Chinese (Simplified)", tag: "zh-Hans-US" },
    { lang: "French (US)", tag: "fr-US" },
    { lang: "Vietnamese (US)", tag: "vi-US" },
    { lang: "Korean (US)", tag: "ko-US" },
    { lang: "Tagalog (US)", tag: "tl-US" },
    { lang: "Russian (US)", tag: "ru-US" },
    { lang: "Arabic (US)", tag: "ar-US" },
    { lang: "Haitian Creole (US)", tag: "ht-US" },
    { lang: "Portuguese (US)", tag: "pt-US" },
  ];

  // Federal specific extensions
  const federalAccessibilityExtensions = [
    // Required by Section 508 for web applications
    {
      description: "US English with standard contrast mode",
      tag: "en-US-u-em-default",
    },
    {
      description: "US English with high contrast mode",
      tag: "en-US-u-em-contrast",
    },

    // Standard date and time formats for government sites
    {
      description: "US English with 24-hour time format",
      tag: "en-US-u-hc-h23",
    },
    {
      description: "US English with standard calendar",
      tag: "en-US-u-ca-gregory",
    },

    // Multiple language support for federal services
    { description: "Spanish with Latin numerals", tag: "es-US-u-nu-latn" },
    { description: "Arabic with Latin numerals", tag: "ar-US-u-nu-latn" },
  ];

  // Screen reader compliance tags
  const screenReaderComplianceTags = [
    {
      description: "US English with screen reader optimization",
      tag: "en-US-x-sr",
    },
    {
      description: "US English simplified for cognitive disabilities",
      tag: "en-US-x-cog",
    },
    { description: "US English for speech recognition", tag: "en-US-x-speech" },
    {
      description: "US English for keyboard-only navigation",
      tag: "en-US-x-kbd",
    },
  ];

  describe("Federal Language Support", () => {
    it("should validate all federal government language tags", () => {
      govLanguageTags.forEach(({ lang, tag }) => {
        const result = validateLanguageTag(tag);
        expect(
          result.isWellFormed,
          `${lang} (${tag}) should be well-formed`
        ).toBe(true);
        expect(result.isValid, `${lang} (${tag}) should be valid`).toBe(true);

        // Parsed tag structure should be correct
        const parsedTag = parseTag(tag);
        expect(parsedTag).not.toBeNull();

        // Language and region should be correctly identified
        const [language, region] = tag.split("-");
        expect(parsedTag?.language).toBe(language.toLowerCase());
        if (region && !region.includes("Hans")) {
          expect(parsedTag?.region).toBe(region.toLowerCase());
        }
      });
    });
  });

  describe("Federal Accessibility Extensions", () => {
    it("should validate federal accessibility extensions", () => {
      federalAccessibilityExtensions.forEach(({ description, tag }) => {
        const result = validateLanguageTag(tag);
        expect(
          result.isWellFormed,
          `${description} (${tag}) should be well-formed`
        ).toBe(true);
        expect(result.isValid, `${description} (${tag}) should be valid`).toBe(
          true
        );

        // Extension should be correctly parsed
        const parsedTag = parseTag(tag);
        expect(parsedTag).not.toBeNull();
        expect(parsedTag?.extensions).toBeDefined();
      });
    });
  });

  describe("Screen Reader Compliance", () => {
    it("should validate screen reader compliance tags", () => {
      screenReaderComplianceTags.forEach(({ description, tag }) => {
        const result = validateLanguageTag(tag);
        expect(
          result.isWellFormed,
          `${description} (${tag}) should be well-formed`
        ).toBe(true);
        expect(result.isValid, `${description} (${tag}) should be valid`).toBe(
          true
        );

        // Private use extensions should be correctly parsed
        const parsedTag = parseTag(tag);
        expect(parsedTag).not.toBeNull();
        expect(parsedTag?.privateuse).toBeDefined();
      });
    });
  });

  describe("WCAG 2.2 Compatibility", () => {
    it("should validate language tags with multiple characteristics", () => {
      const wcagTags = [
        // Multiple characteristics for comprehensive accessibility
        {
          description: "US English with high contrast and keyboard navigation",
          tag: "en-US-u-em-contrast-x-kbd",
        },
        {
          description:
            "US Spanish with simplified content and speech recognition",
          tag: "es-US-x-cog-speech",
        },
        {
          description: "US English with screen reader and large text",
          tag: "en-US-x-sr-lt",
        },
      ];

      wcagTags.forEach(({ description, tag }) => {
        const result = validateLanguageTag(tag);
        expect(
          result.isWellFormed,
          `${description} (${tag}) should be well-formed`
        ).toBe(true);
        expect(result.isValid, `${description} (${tag}) should be valid`).toBe(
          true
        );
      });
    });
  });

  describe("Federal Specific Requirements", () => {
    it("should validate standardized government language tags", () => {
      const fedStandardTags = [
        { description: "US English official government", tag: "en-US-x-gov" },
        { description: "US Spanish official government", tag: "es-US-x-gov" },
        { description: "Plain language English", tag: "en-US-x-plain" },
        { description: "Legal English", tag: "en-US-x-legal" },
      ];

      fedStandardTags.forEach(({ description, tag }) => {
        const result = validateLanguageTag(tag);
        expect(
          result.isWellFormed,
          `${description} (${tag}) should be well-formed`
        ).toBe(true);
        expect(result.isValid, `${description} (${tag}) should be valid`).toBe(
          true
        );
      });
    });
  });

  describe("Section 508 Error Detection", () => {
    it("should reject invalid tags that would cause Section 508 compliance issues", () => {
      const invalidTags = [
        { tag: "en--US", reason: "Malformed language tag" },
        { tag: "america", reason: "Non-ISO language code" },
        { tag: "english", reason: "Non-ISO language name" },
      ];

      invalidTags.forEach(({ tag, reason }) => {
        const result = validateLanguageTag(tag);
        expect(result.isValid, `"${tag}" should be invalid (${reason})`).toBe(
          false
        );
      });
    });
  });

  describe("Case Normalization for Government Use", () => {
    it("should normalize case according to federal standards (BCP-47)", () => {
      const testCases = [
        { input: "en-us", expected: "en-US" },
        { input: "EN-US", expected: "en-US" },
        { input: "zH-hANs-uS", expected: "zh-Hans-US" },
        { input: "es-us-U-ca-gregory", expected: "es-US-u-ca-gregory" },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = validateLanguageTag(input);
        expect(result.isWellFormed).toBe(true);

        // Check for proper BCP-47 case normalization
        expect(result.tag?.tag).toBe(expected);
      });
    });
  });
});
