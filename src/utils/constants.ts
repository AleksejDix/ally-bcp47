/**
 * Constants used for BCP-47 language tag validation
 */

/**
 * Regular expressions for validating subtags
 */
export const SUBTAG_REGEX = {
  // Regular expression for a typical language subtag (2 or 3 letters)
  LANGUAGE: /^[a-z]{2,3}$/i,

  // Regular expression for reserved 4-letter language subtags
  LANGUAGE_4: /^[a-z]{4}$/i,

  // Regular expression for registered language subtags (5-8 letters)
  LANGUAGE_5_TO_8: /^[a-z]{5,8}$/i,

  // Regular expression for extended language subtags (always 3 letters)
  EXTLANG: /^[a-z]{3}$/i,

  // Regular expression for script subtags (4 letters)
  SCRIPT: /^[a-z]{4}$/i,

  // Regular expression for region subtags (2 letters or 3 digits)
  REGION: /^([a-z]{2}|[0-9]{3})$/i,

  // Regular expression for variant subtags (5-8 alphanumeric or 4 char starting with digit)
  VARIANT: /^([a-z0-9]{5,8}|[0-9][a-z0-9]{3})$/i,

  // Regular expression for singleton (extension) subtags (single char, not x)
  SINGLETON: /^[a-wyz0-9]$/i,

  // Regular expression for extension subtags (2-8 alphanumeric)
  EXTENSION: /^[a-z0-9]{2,8}$/i,

  // Regular expression for private use subtags (1-8 alphanumeric)
  PRIVATEUSE: /^[a-z0-9]{1,8}$/i,
};

/**
 * Regular expression for the entire language tag, based on the ABNF grammar in RFC 5646
 * This is a simplified version that validates the general structure but not all specific rules
 */
export const LANGUAGE_TAG_REGEX =
  /^(?:(?:[a-z]{2,3}(?:-[a-z]{3}){0,3})|[a-z]{4}|[a-z]{5,8})(?:-[a-z]{4})?(?:-(?:[a-z]{2}|\d{3}))?(?:-(?:[a-z0-9]{5,8}|\d[a-z0-9]{3}))*(?:-[a-wyz0-9](?:-[a-z0-9]{2,8})+)*(?:-x(?:-[a-z0-9]{1,8})+)?|^x(?:-[a-z0-9]{1,8})+$|^[a-z]{1,3}(?:-[a-z]{3}(?:-[a-z]{3}){0,2})?(?:-[a-z]{4})?(?:-(?:[a-z]{2}|\d{3}))?(?:-(?:[a-z0-9]{5,8}|\d[a-z0-9]{3}))*(?:-[a-wyz0-9](?:-[a-z0-9]{2,8})+)*(?:-x(?:-[a-z0-9]{1,8})+)?$/i;

/**
 * The grandfathered irregular tags as defined in RFC 5646
 */
export const IRREGULAR_GRANDFATHERED_TAGS = [
  "en-GB-oed",
  "i-ami",
  "i-bnn",
  "i-default",
  "i-enochian",
  "i-hak",
  "i-klingon",
  "i-lux",
  "i-mingo",
  "i-navajo",
  "i-pwn",
  "i-tao",
  "i-tay",
  "i-tsu",
  "sgn-BE-FR",
  "sgn-BE-NL",
  "sgn-CH-DE",
];

/**
 * The grandfathered regular tags as defined in RFC 5646
 */
export const REGULAR_GRANDFATHERED_TAGS = [
  "art-lojban",
  "cel-gaulish",
  "no-bok",
  "no-nyn",
  "zh-guoyu",
  "zh-hakka",
  "zh-min",
  "zh-min-nan",
  "zh-xiang",
];

/**
 * All grandfathered tags
 */
export const GRANDFATHERED_TAGS = [
  ...IRREGULAR_GRANDFATHERED_TAGS,
  ...REGULAR_GRANDFATHERED_TAGS,
];
