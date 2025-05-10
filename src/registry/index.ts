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
  getLanguagePreferredValue,
  getExtlangPreferredValue,
  hasPreferredLanguageValue,
  isExtendedLanguageSubtag,
} from "./iso639.js";

import {
  isValidRegionCode,
  getSuggestedRegionCode,
  getRegionPreferredValue,
  hasPreferredRegionValue,
} from "./iso3166.js";

import {
  isValidScriptCode,
  normalizeScriptCode,
  getScriptPreferredValue,
  hasPreferredScriptValue,
  getLanguageSubtagSuppressScript,
  hasRedundantScript,
} from "./iso15924.js";

import { validateLanguageTag } from "../validators/validator.js";

/**
 * Normalizes a BCP-47 language tag to canonical form
 * implementing the canonicalization rules in RFC 5646 Section 4.5
 *
 * @param tag The language tag to normalize
 * @returns The canonical form of the language tag
 */
export function normalizeTag(tag: string): string {
  const parts = tag.trim().split("-");

  if (parts.length === 0) return "";

  // Step 1: Normalize and validate each subtag
  const normalizedParts = normalizeCaseForSubtags(parts);

  // Structure to hold canonical components
  const canonical = {
    language: "",
    extlang: [] as string[],
    script: "",
    region: "",
    variants: [] as string[],
    extensions: {} as Record<string, string[]>,
    privateUse: [] as string[],
  };

  // Step 2: Parse the tag into components
  let currentComponent = "language";
  let currentSingleton = "";

  for (let i = 0; i < normalizedParts.length; i++) {
    const part = normalizedParts[i];

    // Handle private use section (starts with 'x')
    if (part === "x") {
      // Collect all remaining subtags as private use
      const privateUseSubtags = normalizedParts.slice(i + 1);
      canonical.privateUse = privateUseSubtags;
      break; // Stop processing - private use is always at the end
    }

    // Handle extension singletons
    if (part.length === 1 && /^[a-z]$/.test(part) && part !== "x") {
      currentComponent = "extension";
      currentSingleton = part;
      canonical.extensions[currentSingleton] = [];
      continue;
    }

    if (currentComponent === "language") {
      canonical.language = part;
      currentComponent = "extlang";
    } else if (currentComponent === "extlang") {
      if (isExtendedLanguageSubtag(part)) {
        canonical.extlang.push(part);
      } else if (isValidScriptCode(part)) {
        canonical.script = part;
        currentComponent = "region";
      } else if (
        (part.length === 2 && /^[A-Z]{2}$/.test(part)) ||
        (part.length === 3 && /^\d{3}$/.test(part))
      ) {
        canonical.region = part;
        currentComponent = "variant";
      } else {
        canonical.variants.push(part);
        currentComponent = "variant";
      }
    } else if (currentComponent === "region") {
      if (
        (part.length === 2 && /^[A-Z]{2}$/.test(part)) ||
        (part.length === 3 && /^\d{3}$/.test(part))
      ) {
        canonical.region = part;
        currentComponent = "variant";
      } else {
        canonical.variants.push(part);
        currentComponent = "variant";
      }
    } else if (currentComponent === "variant") {
      canonical.variants.push(part);
    } else if (currentComponent === "extension") {
      canonical.extensions[currentSingleton].push(part.toLowerCase());
    }
  }

  // Step 3: Apply preferred values for subtags
  applyPreferredValues(canonical);

  // Step 4: Handle extlang simplification
  handleExtlangSimplification(canonical);

  // Step 5: Remove redundant script tags
  if (canonical.script && hasRedundantScript(canonical.language, canonical.script)) {
    canonical.script = "";
  }

  // Step 6: Rebuild the canonical tag
  return rebuildCanonicalTag(canonical);
}

/**
 * Canonicalizes a language tag to its canonical form
 *
 * @param tag The language tag to canonicalize
 * @returns The canonicalized tag or null if the tag is invalid
 */
export function canonicalizeTag(tag: string): string | null {
  // First check if the tag is well-formed using the validateLanguageTag function
  const validation = validateLanguageTag(tag, { checkRegistry: false });
  if (!validation.isWellFormed || !validation.tag) {
    return null;
  }

  // Use our normalizeTag function to properly canonicalize the tag
  return normalizeTag(tag);
}

/**
 * Normalizes case for all subtags according to BCP-47 rules
 */
function normalizeCaseForSubtags(parts: string[]): string[] {
  return parts.map((part, index) => {
    if (index === 0) {
      // Language subtag is lowercase
      return part.toLowerCase();
    } else if (part.length === 4 && isValidScriptCode(part)) {
      // Script subtag is title case
      return normalizeScriptCode(part);
    } else if (
      (part.length === 2 || /^\d{3}$/.test(part)) &&
      isValidRegionCode(part)
    ) {
      // Region subtag is uppercase (except for numeric regions)
      return /^\d{3}$/.test(part) ? part : part.toUpperCase();
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
}

/**
 * Applies preferred values to language, script, and region subtags
 */
function applyPreferredValues(canonical: {
  language: string;
  extlang: string[];
  script: string;
  region: string;
  variants: string[];
  extensions: Record<string, string[]>;
  privateUse: string[];
}): void {
  // Apply preferred value for language
  if (hasPreferredLanguageValue(canonical.language)) {
    canonical.language = getLanguagePreferredValue(canonical.language);
  }

  // Apply preferred value for script
  if (canonical.script && hasPreferredScriptValue(canonical.script)) {
    canonical.script = getScriptPreferredValue(canonical.script);
  }

  // Apply preferred value for region
  if (canonical.region && hasPreferredRegionValue(canonical.region)) {
    canonical.region = getRegionPreferredValue(canonical.region);
  }

  // Apply preferred value for extlang subtags
  canonical.extlang = canonical.extlang.map((extlang) => {
    if (hasPreferredLanguageValue(extlang)) {
      return getExtlangPreferredValue(extlang);
    }
    return extlang;
  });
}

/**
 * Implements extlang simplification rule from RFC 5646 Section 4.5
 * If the language tag starts with a primary language followed by
 * an extlang with the same content, the extlang becomes the primary language
 */
function handleExtlangSimplification(canonical: {
  language: string;
  extlang: string[];
}): void {
  if (canonical.extlang.length > 0) {
    // The preferred value becomes the primary language
    const firstExtlang = canonical.extlang[0];

    // Try to handle zh-cmn -> cmn and similar cases
    if (canonical.language === "zh" && firstExtlang === "cmn") {
      canonical.language = "cmn";
      canonical.extlang = [];
    } else if (canonical.language === "zh" && firstExtlang === "yue") {
      canonical.language = "yue";
      canonical.extlang = [];
    } else {
      // General case for other extlang relationships
      const preferredValue = getExtlangPreferredValue(firstExtlang);
      if (preferredValue && preferredValue !== firstExtlang) {
        canonical.language = preferredValue;
        canonical.extlang = canonical.extlang.slice(1);
      }
    }
  }
}

/**
 * Rebuilds the canonical tag from its components
 */
function rebuildCanonicalTag(canonical: {
  language: string;
  extlang: string[];
  script: string;
  region: string;
  variants: string[];
  extensions: Record<string, string[]>;
  privateUse: string[];
}): string {
  const parts: string[] = [];

  // Add language
  parts.push(canonical.language);

  // Add extlang subtags
  for (const extlang of canonical.extlang) {
    parts.push(extlang);
  }

  // Add script if present
  if (canonical.script) {
    parts.push(canonical.script);
  }

  // Add region if present
  if (canonical.region) {
    parts.push(canonical.region);
  }

  // Add variants (sorted alphabetically)
  if (canonical.variants.length > 0) {
    canonical.variants.sort();
    parts.push(...canonical.variants);
  }

  // Add extensions (sorted by singleton)
  const sortedExtensions = Object.keys(canonical.extensions).sort();
  for (const singleton of sortedExtensions) {
    const values = canonical.extensions[singleton];
    if (values.length > 0) {
      parts.push(singleton);
      // Make sure all extension values are lowercase
      const lowercaseValues = values.map((v) => v.toLowerCase());
      parts.push(...lowercaseValues);
    }
  }

  // Add private use subtags
  if (canonical.privateUse.length > 0) {
    parts.push("x");
    // Make sure all private use subtags are lowercase
    const lowercasePrivateUse = canonical.privateUse.map((p) =>
      p.toLowerCase()
    );
    parts.push(...lowercasePrivateUse);
  }

  return parts.join("-");
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
  if (tag.script) {
    // First check format and then check registry
    if (!isValidScriptCode(tag.script)) {
      // Keep the original script case in the error message for better readability
      const originalCase =
        tag.script.charAt(0).toUpperCase() + tag.script.slice(1).toLowerCase();
      problems.push({
        type: "unknown_script",
        subtag: originalCase,
        subtagType: "script",
        message: `Unknown script subtag: ${tag.script}`,
      });
    }
  }

  // Validate region subtag
  if (tag.region && !isValidRegionCode(tag.region)) {
    const suggestion = getSuggestedRegionCode(tag.region);
    problems.push({
      type: "unknown_region",
      subtag: tag.region.toUpperCase(), // Always use uppercase for region in error messages
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
