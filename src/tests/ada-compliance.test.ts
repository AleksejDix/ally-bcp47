import { describe, it, expect } from "vitest";
import { validateLanguageTag, isWellFormed, isValid, parseTag } from "../index";

/**
 * Americans with Disabilities Act (ADA) Compliance Tests
 *
 * These tests specifically target the language tag validation requirements relevant
 * to ADA compliance for web accessibility in the United States context.
 */
describe("Americans with Disabilities Act Compliance Tests", () => {
  // Official US language tags
  const usLanguageTags = [
    { lang: "English (US)", tag: "en-US" },
    { lang: "English (US, Technical)", tag: "en-US-x-techcomm" },
    { lang: "English (US, Legal)", tag: "en-US-x-legal" },
    { lang: "English (US, Medical)", tag: "en-US-x-medical" },
    { lang: "Spanish (US)", tag: "es-US" },
  ];

  // Common languages spoken in the US
  const commonUsLanguageTags = [
    { lang: "Spanish", tag: "es-US" },
    { lang: "Chinese (Simplified)", tag: "zh-Hans-US" },
    { lang: "Chinese (Traditional)", tag: "zh-Hant-US" },
    { lang: "Tagalog", tag: "tl-US" },
    { lang: "Vietnamese", tag: "vi-US" },
    { lang: "Arabic", tag: "ar-US" },
    { lang: "French", tag: "fr-US" },
    { lang: "Korean", tag: "ko-US" },
    { lang: "Russian", tag: "ru-US" },
    { lang: "German", tag: "de-US" },
    { lang: "Haitian Creole", tag: "ht-US" },
    { lang: "Portuguese", tag: "pt-US" },
    { lang: "Italian", tag: "it-US" },
    { lang: "Polish", tag: "pl-US" },
    { lang: "Japanese", tag: "ja-US" },
    { lang: "Navajo", tag: "nv-US" }, // Indigenous language
    { lang: "Cherokee", tag: "chr-US" }, // Indigenous language
  ];

  // Accessibility extensions important for ADA compliance
  const accessibilityExtensions = [
    // Time formats
    {
      description: "US English with 12-hour time format",
      tag: "en-US-u-hc-h12",
    },

    // Number formatting
    { description: "Spanish with ASCII digits for US", tag: "es-US-u-nu-latn" },
    {
      description: "US with explicit USD currency display",
      tag: "en-US-u-cu-usd",
    },

    // Calendar preferences
    {
      description: "US with explicit Gregorian calendar",
      tag: "en-US-u-ca-gregory",
    },

    // First day of week
    {
      description: "US with Sunday as first day of week",
      tag: "en-US-u-fw-sun",
    },

    // Collation (sorting)
    {
      description: "English with phonebook sorting",
      tag: "en-US-u-co-phonebk",
    },

    // Measurement system
    {
      description: "US with imperial measurements",
      tag: "en-US-u-ms-ussystem",
    },
  ];

  // Screen reader specific extensions
  const screenReaderExtensions = [
    { description: "US English with high contrast", tag: "en-US-x-hc" },
    { description: "US English with screen reader mode", tag: "en-US-x-sr" },
    { description: "US English with simplified content", tag: "en-US-x-sim" },
    {
      description: "US English with dyslexic font preference",
      tag: "en-US-x-dys",
    },
  ];

  describe("US Language Tags", () => {
    it("should validate all official US language tags", () => {
      usLanguageTags.forEach(({ lang, tag }) => {
        const result = validateLanguageTag(tag);
        expect(
          result.isWellFormed,
          `${lang} (${tag}) should be well-formed`
        ).toBe(true);
        expect(result.isValid, `${lang} (${tag}) should be valid`).toBe(true);

        // Parsed tag structure should be correct
        const parsedTag = parseTag(tag);
        expect(parsedTag).not.toBeNull();

        // For standard language-region pair, check components
        if (!tag.includes("-x-")) {
          const [language, region] = tag.split("-");
          expect(parsedTag?.language).toBe(language.toLowerCase());
          expect(parsedTag?.region).toBe(region.toLowerCase());
        }
      });
    });
  });

  describe("Common US Languages", () => {
    it("should validate common languages spoken in the US", () => {
      commonUsLanguageTags.forEach(({ lang, tag }) => {
        const result = validateLanguageTag(tag);
        expect(
          result.isWellFormed,
          `${lang} (${tag}) should be well-formed`
        ).toBe(true);
        expect(result.isValid, `${lang} (${tag}) should be valid`).toBe(true);

        // Additional checks for parsed structure
        const parsedTag = parseTag(tag);
        expect(parsedTag).not.toBeNull();
      });
    });
  });

  describe("Accessibility Extensions", () => {
    it("should validate all accessibility extension tags relevant to ADA", () => {
      accessibilityExtensions.forEach(({ description, tag }) => {
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

  describe("Screen Reader Extensions", () => {
    it("should handle private use extensions for screen readers", () => {
      screenReaderExtensions.forEach(({ description, tag }) => {
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

  describe("Voice Recognition and Synthesis", () => {
    it("should validate tags for voice recognition and synthesis", () => {
      const voiceTags = [
        {
          description: "US English for speech recognition",
          tag: "en-US-x-speech",
        },
        {
          description: "US English for voice synthesis with male voice",
          tag: "en-US-x-voice-male",
        },
        {
          description: "US English for voice synthesis with female voice",
          tag: "en-US-x-voice-female",
        },
        {
          description: "US Spanish for speech recognition",
          tag: "es-US-x-speech",
        },
      ];

      voiceTags.forEach(({ description, tag }) => {
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

  describe("Regional Variations", () => {
    it("should handle regional US English variations", () => {
      const regionalTags = [
        { description: "Southern US English", tag: "en-US-x-south" },
        { description: "New York English", tag: "en-US-x-ny" },
        { description: "Midwest English", tag: "en-US-x-mid" },
        { description: "California English", tag: "en-US-x-ca" },
      ];

      regionalTags.forEach(({ description, tag }) => {
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

  describe("Common ADA-Related Issues", () => {
    it("should identify common issues relevant to ADA compliance", () => {
      // Test cases: invalid tags that could cause accessibility issues
      const invalidTagsForAda = [
        { tag: "en-", reason: "Incomplete tag" },
        { tag: "en-GB-u", reason: "Incomplete extension" },
        { tag: "eng", reason: "Should use 'en' not 'eng'" },
        { tag: "en-USA", reason: "Should be US not USA" },
      ];

      invalidTagsForAda.forEach(({ tag, reason }) => {
        const result = validateLanguageTag(tag);

        if (tag === "en-" || tag === "en-GB-u") {
          // These should fail syntax validation
          expect(
            result.isWellFormed,
            `${tag} should NOT be well-formed (${reason})`
          ).toBe(false);
        }

        if (tag === "eng" || tag === "en-USA") {
          // These might pass syntax validation but fail registry validation
          // but in both cases should be invalid overall
          expect(result.isValid, `${tag} should NOT be valid (${reason})`).toBe(
            false
          );
        }
      });
    });

    it("should reject non-ISO language names", () => {
      const result = validateLanguageTag("english");
      // This should fail registry validation but might pass syntax validation
      expect(result.isValid, "english should NOT be valid").toBe(false);
    });
  });

  describe("Case Normalization", () => {
    it("should normalize case according to BCP-47 standards", () => {
      const testCases = [
        { input: "en-us", expected: "en-US" },
        { input: "EN-US", expected: "en-US" },
        { input: "es-us", expected: "es-US" },
        { input: "zH-Us", expected: "zh-US" },
        { input: "fil-us", expected: "fil-US" },
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
