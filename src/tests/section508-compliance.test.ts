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
    { lang: "Chinese (Simplified)", tag: "zh-US" },
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
      const federalLanguages = [
        "en-US", // English (United States)
        "es-US", // Spanish (United States)
        "fr-US", // French (United States)
        "de-US", // German (United States)
        "zh-US", // Chinese (United States)
        "ja-US", // Japanese (United States)
        "ko-US", // Korean (United States)
        "vi-US", // Vietnamese (United States)
        "tl-US", // Tagalog (United States)
        "ru-US", // Russian (United States)
        "ar-US", // Arabic (United States)
        "ht-US", // Haitian Creole (United States)
        "nv-US", // Navajo (United States)
        "chr-US", // Cherokee (United States)
        "haw-US", // Hawaiian (United States)
        "as-US", // American Sign Language
      ];

      federalLanguages.forEach((tag) => {
        const result = validateLanguageTag(tag);
        expect(result.isWellFormed, `${tag} should be well-formed`).toBe(true);
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
        { input: "EN-us", expected: "en-US" },
        { input: "es-US", expected: "es-US" },
        { input: "DE-us", expected: "de-US" },
        { input: "zh-us", expected: "zh-US" },
        { input: "ZH-us", expected: "zh-US" },
        { input: "JA-us", expected: "ja-US" },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = validateLanguageTag(input);

        // Check for properly normalized tag according to BCP-47 standards
        expect(result.tag?.tag).toBe(expected);
      });
    });
  });
});
