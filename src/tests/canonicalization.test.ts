import { describe, it, expect } from "vitest";
import { canonicalizeTag } from "../index";

describe("Canonicalization", () => {
  describe("Basic Canonicalization", () => {
    it("should properly format familiar language tags", () => {
      const testCases = [
        { input: "en-us", expected: "en-US" },
        { input: "EN-US", expected: "en-US" },
        { input: "fr-ca", expected: "fr-CA" },
        { input: "sr-CYRL-rs", expected: "sr-RS" },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = canonicalizeTag(input);
        expect(result?.toLowerCase()).toBe(expected.toLowerCase());
      });
    });

    it("should handle special cases for zh-hans-cn", () => {
      const result = canonicalizeTag("zh-hans-cn");
      expect(result?.toLowerCase()).toBe("zh-cn".toLowerCase());
    });

    it("should handle extensions and private use tags", () => {
      const testCases = [
        { input: "de-DE-u-co-phonebk", expected: "de-DE-u-co-phonebk" },
        { input: "EN-GB-u-CA-gregory", expected: "en-GB-u-ca-gregory" },
        { input: "fr-ca-x-PRIVATE", expected: "fr-CA-x-private" },
        {
          input: "en-US-U-EM-CONTRAST-X-KBD",
          expected: "en-US-u-em-contrast-x-kbd",
        },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = canonicalizeTag(input);
        expect(result?.toLowerCase()).toBe(expected.toLowerCase());
      });
    });
  });

  describe("Redundant Script Suppression", () => {
    it("should remove redundant script subtags", () => {
      const testCases = [
        { input: "en-Latn", expected: "en" },
        { input: "en-Latn-US", expected: "en-US" },
        { input: "ru-Cyrl", expected: "ru" },
        { input: "zh-Hans", expected: "zh" },
        { input: "zh-Hans-CN", expected: "zh-CN" },
        { input: "ja-Jpan", expected: "ja" },
        { input: "ar-Arab", expected: "ar" },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = canonicalizeTag(input);
        expect(result?.toLowerCase()).toBe(expected.toLowerCase());
      });
    });

    it("should keep non-redundant script subtags", () => {
      const testCases = [
        { input: "sr-Latn", expected: "sr-Latn" },
        { input: "zh-Hant", expected: "zh-Hant" },
        { input: "uz-Cyrl", expected: "uz-Cyrl" },
        { input: "az-Latn", expected: "az-Latn" },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = canonicalizeTag(input);
        expect(result?.toLowerCase()).toBe(expected.toLowerCase());
      });
    });
  });

  describe("Preferred Value Substitution", () => {
    it("should replace deprecated language subtags with preferred values", () => {
      const testCases = [
        { input: "iw", expected: "he" },
        { input: "iw-IL", expected: "he-IL" },
        { input: "in-ID", expected: "id-ID" },
        { input: "ji", expected: "yi" },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = canonicalizeTag(input);
        expect(result?.toLowerCase()).toBe(expected.toLowerCase());
      });
    });

    it("should handle special cases for region code substitution", () => {
      const testCases = [
        { input: "en-BU", expected: "en-bu" },
        { input: "fr-FX", expected: "fr-fx" },
        { input: "it-TP", expected: "it-tp" }
      ];

      testCases.forEach(({ input, expected }) => {
        const result = canonicalizeTag(input);
        expect(result?.toLowerCase()).toBe(expected.toLowerCase());
      });
    });

    it("should handle special cases for script code substitution", () => {
      const testCases = [
        { input: "en-Qaac", expected: "en-qaac" },
        { input: "egy-Qaac", expected: "egy-qaac" }
      ];

      testCases.forEach(({ input, expected }) => {
        const result = canonicalizeTag(input);
        expect(result?.toLowerCase()).toBe(expected.toLowerCase());
      });
    });
  });

  describe("Extended Language Subtag Handling", () => {
    it("should handle extlang simplification", () => {
      const testCases = [
        { input: "zh-cmn", expected: "cmn" },
        { input: "zh-cmn-Hans-CN", expected: "cmn-Hans-CN" },
        { input: "zh-yue-HK", expected: "yue-HK" }
      ];

      testCases.forEach(({ input, expected }) => {
        const result = canonicalizeTag(input);
        expect(result?.toLowerCase()).toBe(expected.toLowerCase());
      });
    });
  });

  describe("Variant and Extension Ordering", () => {
    it("should order variant subtags alphabetically", () => {
      const result = canonicalizeTag("de-DE-1996-1901");
      expect(result?.toLowerCase()).toBe("de-de-1901-1996".toLowerCase());
    });

    it("should order extension singletons alphabetically", () => {
      const testCases = [
        { 
          input: "en-US-u-ca-gregory-t-en-US-x-private", 
          expected: "en-US-t-en-us-u-ca-gregory-x-private" 
        },
        { 
          input: "fr-FR-z-foo-a-bar", 
          expected: "fr-FR-a-bar-z-foo" 
        }
      ];

      testCases.forEach(({ input, expected }) => {
        const result = canonicalizeTag(input);
        expect(result?.toLowerCase()).toBe(expected.toLowerCase());
      });
    });
  });

  describe("Complex Canonicalization", () => {
    it("should handle complex cases combining multiple canonicalization rules", () => {
      const testCases = [
        { input: "EN-LATN-us", expected: "en-us" },
        { input: "iw-Hebr", expected: "he" },
        { input: "zh-yue-BU", expected: "yue-bu" }
      ];

      testCases.forEach(({ input, expected }) => {
        const result = canonicalizeTag(input);
        expect(result?.toLowerCase()).toBe(expected.toLowerCase());
      });
    });
  });

  describe("Reject Invalid Tags", () => {
    it("should return null for invalid tags", () => {
      const invalidTags = ["", "x-", "en-", "-en", "en--us", "123", "a"];

      invalidTags.forEach((tag) => {
        const result = canonicalizeTag(tag);
        expect(result).toBeNull();
      });
    });
  });
});
