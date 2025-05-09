/**
 * Registry exports
 * This file exports all registry-related functions and data
 */

export * from "./iso639.js";
export * from "./iso3166.js";
export * from "./iso15924.js";

import {
  isValidLanguageCode,
  getSuggestedLanguageCode,
  ISO_639_LANGUAGES,
  LANGUAGE_CODE_CORRECTIONS,
} from "./iso639.js";

import {
  isValidRegionCode,
  getSuggestedRegionCode,
  ISO_3166_REGIONS,
  REGION_CODE_CORRECTIONS,
} from "./iso3166.js";

import {
  isValidScriptCode,
  normalizeScriptCode,
  ISO_15924_SCRIPTS,
} from "./iso15924.js";

/**
 * Normalizes a BCP-47 language tag to canonical form
 *
 * @param tag The language tag to normalize
 * @returns The normalized language tag
 */
export function normalizeTag(tag: string): string {
  const parts = tag.trim().split("-");

  if (parts.length === 0) return "";

  // Normalize each part according to BCP-47 rules
  const normalized = parts.map((part, index) => {
    if (index === 0) {
      // Language subtag is lowercase
      return part.toLowerCase();
    } else if (index === 1 && part.length === 4 && isValidScriptCode(part)) {
      // Script subtag is title case
      return normalizeScriptCode(part);
    } else if (
      (index === 1 || index === 2) &&
      (part.length === 2 || /^\d{3}$/.test(part)) &&
      isValidRegionCode(part)
    ) {
      // Region subtag is uppercase
      return part.toUpperCase();
    } else if (part === "x" || part === "X") {
      // Private use identifier is lowercase
      return "x";
    } else if (part.length === 1 && !/^\d+$/.test(part)) {
      // Extension singleton is lowercase
      return part.toLowerCase();
    } else {
      // All other subtags are lowercase
      return part.toLowerCase();
    }
  });

  return normalized.join("-");
}

/**
 * Validates a tag against the registry
 *
 * @param tag The parsed language tag to validate
 * @returns Validation problems found during registry validation
 */
export function validateTagAgainstRegistry(tag: {
  language?: string;
  script?: string;
  region?: string;
  extlang?: string[];
  grandfathered?: boolean;
}): {
  valid: boolean;
  problems: {
    type: string;
    subtag: string;
    subtagType: string;
    message: string;
    suggestedReplacement?: string;
  }[];
} {
  const problems = [];

  // Skip validation for grandfathered tags
  if (tag.grandfathered) {
    return { valid: true, problems: [] };
  }

  // Validate language subtag
  if (tag.language && !isValidLanguageCode(tag.language)) {
    const suggestion = getSuggestedLanguageCode(tag.language);
    problems.push({
      type: "unknown_language",
      subtag: tag.language,
      subtagType: "language",
      message: `Unknown language subtag: ${tag.language}`,
      suggestedReplacement: suggestion,
    });
  }

  // Validate script subtag
  if (tag.script && !isValidScriptCode(tag.script)) {
    problems.push({
      type: "unknown_script",
      subtag: tag.script,
      subtagType: "script",
      message: `Unknown script subtag: ${tag.script}`,
    });
  }

  // Validate region subtag
  if (tag.region && !isValidRegionCode(tag.region)) {
    const suggestion = getSuggestedRegionCode(tag.region);
    problems.push({
      type: "unknown_region",
      subtag: tag.region,
      subtagType: "region",
      message: `Unknown region subtag: ${tag.region}`,
      suggestedReplacement: suggestion,
    });
  }

  // Validate extlang subtags
  if (tag.extlang) {
    for (const extlang of tag.extlang) {
      if (!isValidLanguageCode(extlang)) {
        problems.push({
          type: "unknown_extlang",
          subtag: extlang,
          subtagType: "extlang",
          message: `Unknown extended language subtag: ${extlang}`,
        });
      }
    }
  }

  return {
    valid: problems.length === 0,
    problems,
  };
}
