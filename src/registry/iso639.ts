/**
 * ISO 639 language codes registry
 * This file contains data for validating language subtags against the official registry
 */

/**
 * Map of valid ISO 639-1/639-2/639-3 language codes
 * Key: language code, Value: language name
 */
export const ISO_639_LANGUAGES: Record<string, string> = {
  // Most common languages first
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  zh: "Chinese",
  ja: "Japanese",
  ru: "Russian",
  ar: "Arabic",
  it: "Italian",
  pt: "Portuguese",

  // European languages
  bg: "Bulgarian",
  hr: "Croatian",
  cs: "Czech",
  da: "Danish",
  nl: "Dutch",
  et: "Estonian",
  fi: "Finnish",
  el: "Greek",
  hu: "Hungarian",
  ga: "Irish",
  lv: "Latvian",
  lt: "Lithuanian",
  lb: "Luxembourgish",
  mt: "Maltese",
  pl: "Polish",
  ro: "Romanian",
  sk: "Slovak",
  sl: "Slovenian",
  sv: "Swedish",

  // Regional and minority European languages
  eu: "Basque",
  ca: "Catalan",
  gl: "Galician",
  cy: "Welsh",
  gd: "Scottish Gaelic",
  fy: "Frisian",
  se: "Northern Sami",
  br: "Breton",
  oc: "Occitan",
  co: "Corsican",
  sc: "Sardinian",
  fur: "Friulian",
  lld: "Ladin",
  hsb: "Upper Sorbian",
  dsb: "Lower Sorbian",
  rm: "Romansh",

  // Swiss German
  gsw: "Swiss German",

  // Other major world languages
  hi: "Hindi",
  bn: "Bengali",
  ko: "Korean",
  tr: "Turkish",
  fa: "Persian",
  he: "Hebrew",
  th: "Thai",
  vi: "Vietnamese",
  id: "Indonesian",
  ms: "Malay",
  uk: "Ukrainian",
  be: "Belarusian",
  sr: "Serbian",
  mk: "Macedonian",
  az: "Azerbaijani",
  hy: "Armenian",
  ka: "Georgian",
  sq: "Albanian",
  bs: "Bosnian",
  no: "Norwegian",
  nb: "Norwegian Bokmål",
  nn: "Norwegian Nynorsk",
  is: "Icelandic",
  uz: "Uzbek",

  // US-relevant languages (for ADA tests)
  tl: "Tagalog",
  ht: "Haitian Creole",
  nv: "Navajo",
  chr: "Cherokee",

  // Extended languages
  cmn: "Mandarin Chinese",
  yue: "Cantonese Chinese",
  cnr: "Montenegrin", // Not officially in ISO 639 yet
};

/**
 * Map of common incorrect language codes to their correct forms
 * Key: incorrect code, Value: correct code
 */
export const LANGUAGE_CODE_CORRECTIONS: Record<string, string> = {
  ch: "zh", // Common mistake: Switzerland country code instead of Chinese
  uk: "en", // Common mistake: UK country code instead of English
  us: "en", // Common mistake: US country code instead of English
  jp: "ja", // Common mistake: Japan country code instead of Japanese
  gr: "el", // Common mistake: Greece country code instead of Greek
  se: "sv", // Common mistake: Sweden country code instead of Swedish
};

/**
 * Map of preferred values for language codes
 * According to BCP-47 canonicalization rules
 */
export const LANGUAGE_PREFERRED_VALUES: Record<string, string> = {
  // Macrolanguage mappings
  no: "nb", // Norwegian -> Norwegian Bokmål

  // Legacy language mappings
  iw: "he", // Hebrew (legacy code)
  ji: "yi", // Yiddish (legacy code)
  in: "id", // Indonesian (legacy code)

  // Other mappings per IANA registry
  tl: "fil", // Tagalog -> Filipino (when available)
};

/**
 * Extended language subtags (ISO 639-3 codes used as extlang)
 * These can appear as extlang subtags after a macrolanguage
 */
export const EXTENDED_LANGUAGE_SUBTAGS: string[] = [
  "cmn", // Mandarin Chinese (extlang of zh)
  "yue", // Cantonese Chinese (extlang of zh)
  "hsn", // Xiang Chinese (extlang of zh)
  "nan", // Min Nan Chinese (extlang of zh)
  "hak", // Hakka Chinese (extlang of zh)
  "wuu", // Wu Chinese (extlang of zh)
  "gan", // Gan Chinese (extlang of zh)

  // Arabic dialects
  "aao", // Algerian Arabic (extlang of ar)
  "abh", // Tajiki Arabic (extlang of ar)
  "acm", // Mesopotamian Arabic (extlang of ar)
  "acq", // Ta'izzi-Adeni Arabic (extlang of ar)
  "acw", // Hijazi Arabic (extlang of ar)
  "acx", // Omani Arabic (extlang of ar)
  "acy", // Cypriot Arabic (extlang of ar)
  "adf", // Dhofari Arabic (extlang of ar)

  // Malay variants
  "zsm", // Standard Malay (extlang of ms)
  "bjn", // Banjar (extlang of ms)
  "mbf", // Baba Malay (extlang of ms)

  // More can be added as needed
];

/**
 * Map of extlang subtags to their preferred values
 */
export const EXTLANG_PREFERRED_VALUES: Record<string, string> = {
  cmn: "zh-cmn", // Mandarin -> zh-cmn
  yue: "zh-yue", // Cantonese -> zh-yue
  zsm: "ms-zsm", // Standard Malay -> ms-zsm
};

/**
 * Checks if a language code is valid according to ISO 639
 *
 * @param code The language code to validate
 * @returns True if the code is valid, false otherwise
 */
export function isValidLanguageCode(code: string): boolean {
  return code.toLowerCase() in ISO_639_LANGUAGES;
}

/**
 * Gets a suggestion for an invalid language code
 *
 * @param code The invalid language code
 * @returns A suggested correction or undefined if no suggestion is available
 */
export function getSuggestedLanguageCode(code: string): string | undefined {
  return LANGUAGE_CODE_CORRECTIONS[code.toLowerCase()];
}

/**
 * Checks if a language code has a preferred value in the registry
 *
 * @param code The language code to check
 * @returns True if the code has a preferred value, false otherwise
 */
export function hasPreferredLanguageValue(code: string): boolean {
  return code.toLowerCase() in LANGUAGE_PREFERRED_VALUES;
}

/**
 * Gets the preferred value for a language code
 *
 * @param code The language code to get the preferred value for
 * @returns The preferred value or the original code if no preferred value exists
 */
export function getLanguagePreferredValue(code: string): string {
  const lowerCode = code.toLowerCase();
  return lowerCode in LANGUAGE_PREFERRED_VALUES
    ? LANGUAGE_PREFERRED_VALUES[lowerCode]
    : lowerCode;
}

/**
 * Checks if a code is an extended language subtag
 *
 * @param code The code to check
 * @returns True if the code is an extended language subtag, false otherwise
 */
export function isExtendedLanguageSubtag(code: string): boolean {
  return EXTENDED_LANGUAGE_SUBTAGS.includes(code.toLowerCase());
}

/**
 * Gets the preferred value for an extlang subtag
 *
 * @param code The extlang code to get the preferred value for
 * @returns The preferred value or the original code if no preferred value exists
 */
export function getExtlangPreferredValue(code: string): string {
  const lowerCode = code.toLowerCase();
  return lowerCode in EXTLANG_PREFERRED_VALUES
    ? EXTLANG_PREFERRED_VALUES[lowerCode]
    : lowerCode;
}
