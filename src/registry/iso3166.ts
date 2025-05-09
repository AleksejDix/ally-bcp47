/**
 * ISO 3166 country/region codes registry
 * This file contains data for validating region subtags against the official registry
 */

/**
 * Map of valid ISO 3166-1 alpha-2 country codes
 * Key: country code, Value: country name
 */
export const ISO_3166_REGIONS: Record<string, string> = {
  // European countries
  AT: "Austria",
  BE: "Belgium",
  BG: "Bulgaria",
  HR: "Croatia",
  CY: "Cyprus",
  CZ: "Czech Republic",
  DK: "Denmark",
  EE: "Estonia",
  FI: "Finland",
  FR: "France",
  DE: "Germany",
  GR: "Greece",
  HU: "Hungary",
  IE: "Ireland",
  IT: "Italy",
  LV: "Latvia",
  LT: "Lithuania",
  LU: "Luxembourg",
  MT: "Malta",
  NL: "Netherlands",
  PL: "Poland",
  PT: "Portugal",
  RO: "Romania",
  SK: "Slovakia",
  SI: "Slovenia",
  ES: "Spain",
  SE: "Sweden",

  // Other European countries
  GB: "United Kingdom",
  CH: "Switzerland",
  NO: "Norway",
  IS: "Iceland",
  LI: "Liechtenstein",
  MC: "Monaco",
  AD: "Andorra",
  SM: "San Marino",
  VA: "Vatican City",
  AL: "Albania",
  BA: "Bosnia and Herzegovina",
  ME: "Montenegro",
  MK: "North Macedonia",
  RS: "Serbia",
  MD: "Moldova",
  UA: "Ukraine",
  BY: "Belarus",
  RU: "Russia",
  TR: "Turkey",
  GE: "Georgia",
  AM: "Armenia",
  AZ: "Azerbaijan",

  // Major world regions
  US: "United States",
  CA: "Canada",
  MX: "Mexico",
  BR: "Brazil",
  AR: "Argentina",
  AU: "Australia",
  NZ: "New Zealand",
  CN: "China",
  JP: "Japan",
  KR: "South Korea",
  IN: "India",
  ID: "Indonesia",
  MY: "Malaysia",
  SG: "Singapore",
  TH: "Thailand",
  VN: "Vietnam",
  ZA: "South Africa",
  NG: "Nigeria",
  EG: "Egypt",
  SA: "Saudi Arabia",
  AE: "United Arab Emirates",
  IL: "Israel",
  UZ: "Uzbekistan",

  // UN regions
  "001": "World",
  "002": "Africa",
  "019": "Americas",
  "142": "Asia",
  "150": "Europe",
  "009": "Oceania",

  // Special regions
  "419": "Latin America",
};

/**
 * Map of common incorrect region codes to their correct forms
 * Key: incorrect code, Value: correct code
 */
export const REGION_CODE_CORRECTIONS: Record<string, string> = {
  UK: "GB", // Common mistake: UK instead of GB for United Kingdom
  EU: "150", // EU is not a valid ISO 3166 code, suggest Europe (150)
  EN: "GB", // Common mistake: English language code instead of GB
  LA: "419", // LA is sometimes used for Latin America, correct is 419
};

/**
 * Checks if a region code is valid according to ISO 3166
 *
 * @param code The region code to validate
 * @returns True if the code is valid, false otherwise
 */
export function isValidRegionCode(code: string): boolean {
  return code.toUpperCase() in ISO_3166_REGIONS;
}

/**
 * Gets a suggestion for an invalid region code
 *
 * @param code The invalid region code
 * @returns A suggested correction or undefined if no suggestion is available
 */
export function getSuggestedRegionCode(code: string): string | undefined {
  return REGION_CODE_CORRECTIONS[code.toUpperCase()];
}
