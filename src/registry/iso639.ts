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
