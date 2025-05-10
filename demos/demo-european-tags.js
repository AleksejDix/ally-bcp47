import { validateLanguageTag } from "./dist/index.js";

// EU Member States with their languages
const euLanguageTags = [
  // Format: [country name, language tags]
  ["Austria", ["de-AT"]],
  ["Belgium", ["nl-BE", "fr-BE", "de-BE"]],
  ["Bulgaria", ["bg-BG"]],
  ["Croatia", ["hr-HR"]],
  ["Cyprus", ["el-CY", "tr-CY"]],
  ["Czech Republic", ["cs-CZ"]],
  ["Denmark", ["da-DK"]],
  ["Estonia", ["et-EE"]],
  ["Finland", ["fi-FI", "sv-FI"]],
  ["France", ["fr-FR"]],
  ["Germany", ["de-DE"]],
  ["Greece", ["el-GR"]],
  ["Hungary", ["hu-HU"]],
  ["Ireland", ["en-IE", "ga-IE"]],
  ["Italy", ["it-IT"]],
  ["Latvia", ["lv-LV"]],
  ["Lithuania", ["lt-LT"]],
  ["Luxembourg", ["lb-LU", "fr-LU", "de-LU"]],
  ["Malta", ["mt-MT", "en-MT"]],
  ["Netherlands", ["nl-NL"]],
  ["Poland", ["pl-PL"]],
  ["Portugal", ["pt-PT"]],
  ["Romania", ["ro-RO"]],
  ["Slovakia", ["sk-SK"]],
  ["Slovenia", ["sl-SI"]],
  ["Spain", ["es-ES", "ca-ES", "gl-ES", "eu-ES"]],
  ["Sweden", ["sv-SE"]],
];

// Some European regional/minority languages
const regionalLanguageTags = [
  ["Basque (Spain)", "eu-ES"],
  ["Catalan (Spain)", "ca-ES"],
  ["Welsh (UK)", "cy-GB"],
  ["Scottish Gaelic (UK)", "gd-GB"],
  ["Frisian (Netherlands)", "fy-NL"],
  ["Sami (Finland)", "se-FI"],
  ["Breton (France)", "br-FR"],
  ["Occitan (France)", "oc-FR"],
];

// Example with accessibility extensions
const accessibilityTags = [
  ["German (phonebook sort)", "de-DE-u-co-phonebk"],
  ["French (Latin numerals)", "fr-FR-u-nu-latn"],
  ["UK English (Islamic calendar)", "en-GB-u-ca-islamic"],
  ["Spanish (Monday first day)", "es-ES-u-fw-mon"],
];

// Problematic tags
const problematicTags = [
  ["Swiss 'language' + Germany (incorrect)", "ch-DE"],
  ["UK 'language' + Germany (incorrect)", "uk-DE"],
  ["EU as region (invalid)", "en-EU"],
  ["Incomplete tag", "en-"],
];

// Print header
console.log("=== European Language Tag Validation ===\n");

// Test and print results for EU Member State languages
console.log("EU Member State Official Languages:");
console.log("------------------------------------");
euLanguageTags.forEach(([country, tags]) => {
  console.log(`\n${country}:`);
  tags.forEach((tag) => {
    const result = validateLanguageTag(tag);
    console.log(
      `  ${tag}: ${result.isWellFormed ? "✓ well-formed" : "✗ malformed"}, ${
        result.isValid ? "✓ valid" : "✗ invalid"
      }`
    );
  });
});

// Test regional languages
console.log("\n\nRegional and Minority Languages:");
console.log("--------------------------------");
regionalLanguageTags.forEach(([description, tag]) => {
  const result = validateLanguageTag(tag);
  console.log(
    `${description} (${tag}): ${
      result.isWellFormed ? "✓ well-formed" : "✗ malformed"
    }, ${result.isValid ? "✓ valid" : "✗ invalid"}`
  );
});

// Test accessibility extensions
console.log("\n\nAccessibility Extensions:");
console.log("------------------------");
accessibilityTags.forEach(([description, tag]) => {
  const result = validateLanguageTag(tag);
  console.log(
    `${description} (${tag}): ${
      result.isWellFormed ? "✓ well-formed" : "✗ malformed"
    }, ${result.isValid ? "✓ valid" : "✗ invalid"}`
  );
});

// Test problematic tags
console.log("\n\nProblematic Tags:");
console.log("----------------");
problematicTags.forEach(([description, tag]) => {
  const result = validateLanguageTag(tag);
  console.log(
    `${description} (${tag}): ${
      result.isWellFormed ? "✓ well-formed" : "✗ malformed"
    }, ${result.isValid ? "✓ valid" : "✗ invalid"}`
  );

  // For ch-DE, add an explanation
  if (tag === "ch-DE") {
    console.log(
      "  Note: ch-DE passes syntax validation but should fail registry validation"
    );
    console.log(
      "  'ch' is a country code for Switzerland, not a language code"
    );
    console.log(
      "  Correct alternatives: de-CH (German in Switzerland) or gsw-CH (Swiss German)"
    );
  }
});

console.log("\n=== End of European Language Tag Validation ===");
