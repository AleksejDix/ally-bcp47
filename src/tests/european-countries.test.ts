import { describe, it, expect } from "vitest";
import { validateLanguageTag, isWellFormed, isValid } from "../index";

describe("European Countries Language Tag Validation", () => {
  // EU Member States
  const euMemberStates = [
    { country: "Austria", tags: ["de-AT"] },
    { country: "Belgium", tags: ["nl-BE", "fr-BE", "de-BE"] },
    { country: "Bulgaria", tags: ["bg-BG"] },
    { country: "Croatia", tags: ["hr-HR"] },
    { country: "Cyprus", tags: ["el-CY", "tr-CY"] },
    { country: "Czech Republic", tags: ["cs-CZ"] },
    { country: "Denmark", tags: ["da-DK"] },
    { country: "Estonia", tags: ["et-EE"] },
    { country: "Finland", tags: ["fi-FI", "sv-FI"] },
    { country: "France", tags: ["fr-FR"] },
    { country: "Germany", tags: ["de-DE"] },
    { country: "Greece", tags: ["el-GR"] },
    { country: "Hungary", tags: ["hu-HU"] },
    { country: "Ireland", tags: ["en-IE", "ga-IE"] },
    { country: "Italy", tags: ["it-IT"] },
    { country: "Latvia", tags: ["lv-LV"] },
    { country: "Lithuania", tags: ["lt-LT"] },
    { country: "Luxembourg", tags: ["lb-LU", "fr-LU", "de-LU"] },
    { country: "Malta", tags: ["mt-MT", "en-MT"] },
    { country: "Netherlands", tags: ["nl-NL"] },
    { country: "Poland", tags: ["pl-PL"] },
    { country: "Portugal", tags: ["pt-PT"] },
    { country: "Romania", tags: ["ro-RO"] },
    { country: "Slovakia", tags: ["sk-SK"] },
    { country: "Slovenia", tags: ["sl-SI"] },
    { country: "Spain", tags: ["es-ES", "ca-ES", "gl-ES", "eu-ES"] },
    { country: "Sweden", tags: ["sv-SE"] },
  ];

  // Non-EU European countries
  const nonEuEuropeanCountries = [
    { country: "United Kingdom", tags: ["en-GB"] },
    { country: "Switzerland", tags: ["de-CH", "fr-CH", "it-CH", "rm-CH"] },
    { country: "Norway", tags: ["no-NO", "nb-NO", "nn-NO"] },
    { country: "Iceland", tags: ["is-IS"] },
    { country: "Liechtenstein", tags: ["de-LI"] },
    { country: "Monaco", tags: ["fr-MC"] },
    { country: "Andorra", tags: ["ca-AD"] },
    { country: "San Marino", tags: ["it-SM"] },
    { country: "Vatican City", tags: ["it-VA"] },
    { country: "Albania", tags: ["sq-AL"] },
    { country: "Bosnia and Herzegovina", tags: ["bs-BA", "hr-BA", "sr-BA"] },
    { country: "Montenegro", tags: ["cnr-ME", "sr-ME"] }, // cnr is Montenegrin, not yet in ISO 639
    { country: "North Macedonia", tags: ["mk-MK"] },
    { country: "Serbia", tags: ["sr-RS"] },
    { country: "Moldova", tags: ["ro-MD"] },
    { country: "Ukraine", tags: ["uk-UA"] },
    { country: "Belarus", tags: ["be-BY"] },
    { country: "Russia", tags: ["ru-RU"] },
    { country: "Turkey", tags: ["tr-TR"] },
    { country: "Georgia", tags: ["ka-GE"] },
    { country: "Armenia", tags: ["hy-AM"] },
    { country: "Azerbaijan", tags: ["az-AZ"] },
  ];

  // Special cases and variants
  const specialCases = [
    { country: "Switzerland (German with variant)", tags: ["de-CH-1901"] }, // Traditional German orthography
    { country: "Spain (Latin American Spanish)", tags: ["es-419"] }, // Spanish in Latin America
    { country: "Belgium (Flemish)", tags: ["nl-BE-vlaams"] }, // Flemish variant
    { country: "Italy (Sardinian)", tags: ["sc-IT"] }, // Sardinian
    { country: "France (Breton)", tags: ["br-FR"] }, // Breton
    { country: "United Kingdom (Scottish Gaelic)", tags: ["gd-GB"] }, // Scottish Gaelic
    { country: "Spain (Valencia)", tags: ["ca-ES-valencia"] }, // Valencian
    { country: "France (Provençal)", tags: ["oc-FR"] }, // Occitan
    { country: "Germany (Upper Sorbian)", tags: ["hsb-DE"] }, // Upper Sorbian
    { country: "Serbia (Latin script)", tags: ["sr-Latn-RS"] }, // Serbian in Latin script
  ];

  // Helper function to validate tags
  const validateTags = (country: string, tags: string[], skipValidityCheck = false) => {
    tags.forEach((tag) => {
      const result = validateLanguageTag(tag);
      expect(result.isWellFormed, `${country} tag ${tag} should be well-formed`).toBe(true);
      
      if (!skipValidityCheck) {
        expect(result.isValid, `${country} tag ${tag} should be valid`).toBe(true);
        expect(isValid(tag), `${country} tag ${tag} should pass isValid`).toBe(true);
      }
      
      expect(isWellFormed(tag), `${country} tag ${tag} should pass isWellFormed`).toBe(true);
    });
  };

  // Test EU Member States
  describe("EU Member States", () => {
    it("should validate all EU member state language tags", () => {
      euMemberStates.forEach(({ country, tags }) => {
        validateTags(country, tags);
      });
    });
  });

  // Test Non-EU European Countries
  describe("Non-EU European Countries", () => {
    it("should validate all non-EU European country language tags", () => {
      nonEuEuropeanCountries.forEach(({ country, tags }) => {
        // Skip validity check for Montenegrin code (cnr) as it's not yet in ISO 639
        const skipValidityCheck = tags.includes("cnr-ME");
        validateTags(country, tags, skipValidityCheck);
      });
    });
  });

  // Test Special Cases
  describe("Special Cases and Variants", () => {
    it("should validate all special case language tags", () => {
      specialCases.forEach(({ country, tags }) => {
        validateTags(country, tags);
      });
    });
  });

  // Test incorrect/invalid European country tags
  describe("Invalid European Tags", () => {
    const invalidTags = [
      { tag: "xx-DE", description: "Invalid language code", shouldBeWellFormed: true },
      { tag: "de-XX", description: "Invalid country code", shouldBeWellFormed: true },
      { tag: "en-EU", description: "EU is not a valid country code", shouldBeWellFormed: true },
      { tag: "ch-DE", description: "ch is not a language code", shouldBeWellFormed: true },
      { tag: "de-DE-", description: "Trailing hyphen", shouldBeWellFormed: false },
      { tag: "fr-FR-fr", description: "Duplicate language as variant", shouldBeWellFormed: false },
    ];

    it("should correctly identify invalid European tags", () => {
      invalidTags.forEach(({ tag, description, shouldBeWellFormed }) => {
        const result = validateLanguageTag(tag);
        expect(result.isWellFormed, `${description} (${tag})`).toBe(shouldBeWellFormed);
      });
    });
  });

  // Test for accessibility-related extensions
  describe("Accessibility Extensions", () => {
    const accessibilityTags = [
      "en-GB-u-co-phonebk", // Phonebook sort order
      "de-DE-u-co-phonebk", // Phonebook sort order for German
      "fr-FR-u-nu-latn", // Latin numerals
      "ar-SA-u-nu-latn", // Arabic with Latin numerals
      "en-GB-u-ca-islamic", // Islamic calendar
      "de-DE-u-fw-mon", // First day of week is Monday
      "es-ES-u-co-trad", // Traditional sort
    ];

    it("should validate language tags with accessibility extensions", () => {
      accessibilityTags.forEach((tag) => {
        const result = validateLanguageTag(tag);
        expect(result.isWellFormed, `Tag ${tag} should be well-formed`).toBe(true);
        expect(result.isValid, `Tag ${tag} should be valid`).toBe(true);
      });
    });
  });

  // Test for transformations
  describe("Tag Normalization", () => {
    const testCases = [
      { input: "EN-GB", expected: "en-GB" },
      { input: "FR-fr", expected: "fr-FR" },
      { input: "De-Ch", expected: "de-CH" },
      { input: "IT-it", expected: "it-IT" },
    ];

    it("should correctly normalize case in language tags", () => {
      testCases.forEach(({ input, expected }) => {
        const result = validateLanguageTag(input);
        expect(result.isWellFormed).toBe(true);
        expect(result.tag?.tag).toBe(expected);
      });
    });
  });
});
