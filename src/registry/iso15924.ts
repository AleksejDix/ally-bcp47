/**
 * ISO 15924 script codes registry
 * This file contains data for validating script subtags against the official registry
 */

/**
 * Map of valid ISO 15924 script codes
 * Key: script code, Value: script name
 */
export const ISO_15924_SCRIPTS: Record<string, string> = {
  // Latin-based scripts
  Latn: "Latin",
  Ital: "Old Italic",
  Fraktur: "Fraktur variant of Latin",

  // Cyrillic-based scripts
  Cyrl: "Cyrillic",
  Glag: "Glagolitic",

  // Greek-based scripts
  Grek: "Greek",
  Cprt: "Cypriot",

  // Major Asian scripts
  Hans: "Han (Simplified)",
  Hant: "Han (Traditional)",
  Jpan: "Japanese",
  Kore: "Korean",
  Hira: "Hiragana",
  Kana: "Katakana",
  Hang: "Hangul",
  Bopo: "Bopomofo",

  // South Asian scripts
  Deva: "Devanagari",
  Beng: "Bengali",
  Guru: "Gurmukhi",
  Gujr: "Gujarati",
  Orya: "Oriya",
  Taml: "Tamil",
  Telu: "Telugu",
  Knda: "Kannada",
  Mlym: "Malayalam",
  Sinh: "Sinhala",

  // Middle Eastern scripts
  Arab: "Arabic",
  Hebr: "Hebrew",
  Syrc: "Syriac",
  Thaa: "Thaana",

  // Southeast Asian scripts
  Thai: "Thai",
  Laoo: "Lao",
  Mymr: "Myanmar",
  Khmr: "Khmer",

  // Other major scripts
  Ethi: "Ethiopic",
  Geor: "Georgian",
  Armn: "Armenian",
  Tibt: "Tibetan",
  Mong: "Mongolian",

  // Historic scripts
  Runr: "Runic",
  Ogam: "Ogham",

  // Special cases
  Zsym: "Symbols",
  Zsye: "Emoji",
  Zxxx: "Unwritten",
  Zyyy: "Undetermined",
  Zzzz: "Uncoded",
};

/**
 * Map of deprecated script codes to their preferred values
 */
export const SCRIPT_PREFERRED_VALUES: Record<string, string> = {
  Qaai: "Zinh", // Inherited -> Zinh (new code)
  Qaac: "Copt", // Coptic -> Copt (new code)
};

/**
 * Map of language subtags that have a default script
 * that should be suppressed in canonical form
 * Based on RFC 5646 Section 4.1
 */
export const LANGUAGE_SUPPRESS_SCRIPT: Record<string, string> = {
  en: "Latn", // English is written in Latin
  es: "Latn", // Spanish is written in Latin
  fr: "Latn", // French is written in Latin
  de: "Latn", // German is written in Latin
  it: "Latn", // Italian is written in Latin
  pt: "Latn", // Portuguese is written in Latin
  nl: "Latn", // Dutch is written in Latin
  ru: "Cyrl", // Russian is written in Cyrillic
  zh: "Hans", // Chinese default to simplified
  ja: "Jpan", // Japanese uses Japanese script
  ar: "Arab", // Arabic uses Arabic script
  hi: "Deva", // Hindi uses Devanagari
  ko: "Kore", // Korean uses Korean script
  th: "Thai", // Thai uses Thai script
  he: "Hebr", // Hebrew uses Hebrew script
  sv: "Latn", // Swedish is written in Latin
  da: "Latn", // Danish is written in Latin
  fi: "Latn", // Finnish is written in Latin
  nb: "Latn", // Norwegian Bokmål is written in Latin
  nn: "Latn", // Norwegian Nynorsk is written in Latin
  cs: "Latn", // Czech is written in Latin
  sk: "Latn", // Slovak is written in Latin
  pl: "Latn", // Polish is written in Latin
  hu: "Latn", // Hungarian is written in Latin
  ro: "Latn", // Romanian is written in Latin
  bg: "Cyrl", // Bulgarian is written in Cyrillic
  uk: "Cyrl", // Ukrainian is written in Cyrillic
  sr: "Cyrl", // Serbian default to Cyrillic
  mk: "Cyrl", // Macedonian is written in Cyrillic
  be: "Cyrl", // Belarusian is written in Cyrillic
  el: "Grek", // Greek uses Greek script
  vi: "Latn", // Vietnamese is written in Latin
  tr: "Latn", // Turkish is written in Latin
  id: "Latn", // Indonesian is written in Latin
  ms: "Latn", // Malay is written in Latin
  fa: "Arab", // Persian uses Arabic script
  ur: "Arab", // Urdu uses Arabic script
};

/**
 * Checks if a script code is valid according to ISO 15924
 *
 * @param code The script code to validate
 * @returns True if the code is valid, false otherwise
 */
export function isValidScriptCode(code: string): boolean {
  // First check if the script code has a valid format (4 letters)
  if (!/^[a-zA-Z]{4}$/.test(code)) {
    return false;
  }

  // Then check if it has proper casing format (first letter uppercase, rest lowercase)
  const properFormattedCode =
    code.charAt(0).toUpperCase() + code.slice(1).toLowerCase();

  // Finally, check if it exists in our ISO_15924_SCRIPTS registry
  return properFormattedCode in ISO_15924_SCRIPTS;
}

/**
 * Returns the canonical form of a script code (title case)
 *
 * @param code The script code to normalize
 * @returns The normalized script code
 */
export function normalizeScriptCode(code: string): string {
  return code.charAt(0).toUpperCase() + code.slice(1).toLowerCase();
}

/**
 * Checks if a script code has a preferred value in the registry
 *
 * @param code The script code to check
 * @returns True if the code has a preferred value, false otherwise
 */
export function hasPreferredScriptValue(code: string): boolean {
  const normalizedCode = normalizeScriptCode(code);
  return normalizedCode in SCRIPT_PREFERRED_VALUES;
}

/**
 * Gets the preferred value for a script code
 *
 * @param code The script code to get the preferred value for
 * @returns The preferred value or the original code if no preferred value exists
 */
export function getScriptPreferredValue(code: string): string {
  const normalizedCode = normalizeScriptCode(code);
  return normalizedCode in SCRIPT_PREFERRED_VALUES
    ? SCRIPT_PREFERRED_VALUES[normalizedCode]
    : normalizedCode;
}

/**
 * Gets the default script for a language subtag that should be suppressed
 * in canonical form
 *
 * @param language The language subtag to get the suppress script for
 * @returns The script that should be suppressed or undefined if not applicable
 */
export function getLanguageSubtagSuppressScript(
  language: string
): string | undefined {
  return LANGUAGE_SUPPRESS_SCRIPT[language.toLowerCase()];
}

/**
 * Checks if a script subtag is redundant for a given language
 * A script is redundant if it's the default script for the language
 *
 * @param language The language subtag
 * @param script The script subtag
 * @returns True if the script is redundant, false otherwise
 */
export function hasRedundantScript(language: string, script: string): boolean {
  const suppressScript = getLanguageSubtagSuppressScript(language);
  if (!suppressScript) return false;

  return suppressScript.toLowerCase() === script.toLowerCase();
}
