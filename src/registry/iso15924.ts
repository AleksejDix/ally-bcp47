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
 * Checks if a script code is valid according to ISO 15924
 *
 * @param code The script code to validate
 * @returns True if the code is valid, false otherwise
 */
export function isValidScriptCode(code: string): boolean {
  // Script codes are title case in BCP-47
  const titleCase = code.charAt(0).toUpperCase() + code.slice(1).toLowerCase();
  return titleCase in ISO_15924_SCRIPTS;
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
