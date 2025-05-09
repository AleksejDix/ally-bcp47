import {
  LanguageTag,
  ValidationError,
  ValidationErrorType,
} from "../types/index.js";
import { GRANDFATHERED_TAGS, SUBTAG_REGEX } from "../utils/constants.js";

/**
 * Parses a language tag string into its component parts
 * This implements the core parsing functionality according to RFC 5646
 *
 * @param tag The language tag to parse
 * @returns An object representing the parsed language tag, or null if parsing fails
 */
export function parseLanguageTag(tag: string): {
  parsed: LanguageTag | null;
  errors: ValidationError[];
} {
  // Normalize tag: trim whitespace and convert to lowercase
  const normalizedTag = tag.trim().toLowerCase();

  // Check if empty
  if (!normalizedTag) {
    return {
      parsed: null,
      errors: [
        {
          type: ValidationErrorType.MALFORMED_TAG,
          message: "Language tag cannot be empty",
        },
      ],
    };
  }

  // Early processing for grandfathered tags
  if (GRANDFATHERED_TAGS.includes(normalizedTag)) {
    return {
      parsed: {
        tag: normalizedTag,
        grandfathered: true,
      },
      errors: [],
    };
  }

  // Early processing for private-use-only tags (starting with 'x-')
  if (normalizedTag.startsWith("x-")) {
    const privateParts = normalizedTag.split("-").slice(1);

    // Validate each private subtag
    for (let i = 0; i < privateParts.length; i++) {
      if (!SUBTAG_REGEX.PRIVATEUSE.test(privateParts[i])) {
        return {
          parsed: null,
          errors: [
            {
              type: ValidationErrorType.INVALID_PRIVATE_USE,
              message: `Invalid private use subtag: ${privateParts[i]}`,
              subtag: privateParts[i],
              subtagType: "privateuse",
              position: normalizedTag.indexOf(privateParts[i]),
            },
          ],
        };
      }
    }

    return {
      parsed: {
        tag: normalizedTag,
        privateUseOnly: true,
        privateuse: privateParts,
      },
      errors: [],
    };
  }

  // Split tag into subtags
  const subtags = normalizedTag.split("-");
  const result: LanguageTag = { tag: normalizedTag };
  const errors: ValidationError[] = [];

  // Process first subtag - primary language
  const primaryLanguage = subtags[0];

  // Validate primary language subtag
  if (
    !SUBTAG_REGEX.LANGUAGE.test(primaryLanguage) &&
    !SUBTAG_REGEX.LANGUAGE_4.test(primaryLanguage) &&
    !SUBTAG_REGEX.LANGUAGE_5_TO_8.test(primaryLanguage)
  ) {
    errors.push({
      type: ValidationErrorType.INVALID_SYNTAX,
      message: `Invalid primary language subtag: ${primaryLanguage}`,
      subtag: primaryLanguage,
      subtagType: "language",
      position: 0,
    });
    return { parsed: null, errors };
  }

  result.language = primaryLanguage;

  // Process remaining subtags
  let position = 1;
  const extlangs: string[] = [];

  // Track extension singletons seen to detect duplicates
  const seenExtensionSingletons = new Set<string>();

  // Track variants seen to detect duplicates
  const seenVariants = new Set<string>();

  // Track current processing mode
  let mode:
    | "extlang"
    | "script"
    | "region"
    | "variant"
    | "extension"
    | "privateuse"
    | null = null;
  let currentExtensionSingleton: string | null = null;
  let currentExtensionSubtags: string[] = [];

  while (position < subtags.length) {
    const subtag = subtags[position];

    // Check for private use section (starts with 'x')
    if (subtag === "x") {
      // Collect all remaining subtags as private use
      const privateUseSubtags = subtags.slice(position + 1);

      // Validate each private use subtag
      for (let i = 0; i < privateUseSubtags.length; i++) {
        if (!SUBTAG_REGEX.PRIVATEUSE.test(privateUseSubtags[i])) {
          errors.push({
            type: ValidationErrorType.INVALID_PRIVATE_USE,
            message: `Invalid private use subtag: ${privateUseSubtags[i]}`,
            subtag: privateUseSubtags[i],
            subtagType: "privateuse",
            position: normalizedTag.indexOf(privateUseSubtags[i]),
          });
          return { parsed: null, errors };
        }
      }

      result.privateuse = privateUseSubtags;
      break; // Stop processing - private use is always at the end
    }

    // Determine the type of this subtag based on position and format
    if (
      position <= 3 &&
      extlangs.length < 3 &&
      SUBTAG_REGEX.EXTLANG.test(subtag)
    ) {
      // Extended language subtag (can have up to 3)
      extlangs.push(subtag);
      mode = "extlang";
    } else if (!mode || mode === "extlang") {
      // After language and optional extlangs, could be script
      if (SUBTAG_REGEX.SCRIPT.test(subtag)) {
        if (result.script) {
          errors.push({
            type: ValidationErrorType.INVALID_ORDER,
            message: "Multiple script subtags are not allowed",
            subtag: subtag,
            subtagType: "script",
            position: normalizedTag.indexOf(subtag),
          });
          return { parsed: null, errors };
        }
        result.script = subtag;
        mode = "script";
      } else if (SUBTAG_REGEX.REGION.test(subtag)) {
        if (result.region) {
          errors.push({
            type: ValidationErrorType.INVALID_ORDER,
            message: "Multiple region subtags are not allowed",
            subtag: subtag,
            subtagType: "region",
            position: normalizedTag.indexOf(subtag),
          });
          return { parsed: null, errors };
        }
        result.region = subtag;
        mode = "region";
      } else if (SUBTAG_REGEX.VARIANT.test(subtag)) {
        if (!result.variants) {
          result.variants = [];
        }

        // Check for duplicate variants
        if (seenVariants.has(subtag)) {
          errors.push({
            type: ValidationErrorType.DUPLICATE_VARIANT,
            message: `Duplicate variant subtag: ${subtag}`,
            subtag: subtag,
            subtagType: "variant",
            position: normalizedTag.indexOf(
              subtag,
              normalizedTag.indexOf(subtag) + 1
            ),
          });
          return { parsed: null, errors };
        }

        seenVariants.add(subtag);
        result.variants.push(subtag);
        mode = "variant";
      } else if (SUBTAG_REGEX.SINGLETON.test(subtag)) {
        // Extension singleton
        if (seenExtensionSingletons.has(subtag)) {
          errors.push({
            type: ValidationErrorType.DUPLICATE_SINGLETON,
            message: `Duplicate extension singleton: ${subtag}`,
            subtag: subtag,
            subtagType: "extension",
            position: normalizedTag.indexOf(
              subtag,
              normalizedTag.indexOf(subtag) + 1
            ),
          });
          return { parsed: null, errors };
        }

        seenExtensionSingletons.add(subtag);

        // Finish any previous extension
        if (currentExtensionSingleton && currentExtensionSubtags.length > 0) {
          if (!result.extensions) {
            result.extensions = {};
          }
          result.extensions[currentExtensionSingleton] =
            currentExtensionSubtags;
        }

        currentExtensionSingleton = subtag;
        currentExtensionSubtags = [];
        mode = "extension";
      } else {
        // Invalid subtag
        errors.push({
          type: ValidationErrorType.INVALID_SYNTAX,
          message: `Invalid subtag: ${subtag}`,
          subtag: subtag,
          position: normalizedTag.indexOf(subtag),
        });
        return { parsed: null, errors };
      }
    } else if (mode === "script" || mode === "region" || mode === "variant") {
      // After script, could be region, variant, or extension
      if (SUBTAG_REGEX.REGION.test(subtag) && !result.region) {
        result.region = subtag;
        mode = "region";
      } else if (SUBTAG_REGEX.VARIANT.test(subtag)) {
        if (!result.variants) {
          result.variants = [];
        }

        // Check for duplicate variants
        if (seenVariants.has(subtag)) {
          errors.push({
            type: ValidationErrorType.DUPLICATE_VARIANT,
            message: `Duplicate variant subtag: ${subtag}`,
            subtag: subtag,
            subtagType: "variant",
            position: normalizedTag.indexOf(
              subtag,
              normalizedTag.indexOf(subtag) + 1
            ),
          });
          return { parsed: null, errors };
        }

        seenVariants.add(subtag);
        result.variants.push(subtag);
        mode = "variant";
      } else if (SUBTAG_REGEX.SINGLETON.test(subtag)) {
        // Extension singleton
        if (seenExtensionSingletons.has(subtag)) {
          errors.push({
            type: ValidationErrorType.DUPLICATE_SINGLETON,
            message: `Duplicate extension singleton: ${subtag}`,
            subtag: subtag,
            subtagType: "extension",
            position: normalizedTag.indexOf(
              subtag,
              normalizedTag.indexOf(subtag) + 1
            ),
          });
          return { parsed: null, errors };
        }

        seenExtensionSingletons.add(subtag);

        // Finish any previous extension
        if (currentExtensionSingleton && currentExtensionSubtags.length > 0) {
          if (!result.extensions) {
            result.extensions = {};
          }
          result.extensions[currentExtensionSingleton] =
            currentExtensionSubtags;
        }

        currentExtensionSingleton = subtag;
        currentExtensionSubtags = [];
        mode = "extension";
      } else {
        // Invalid subtag
        errors.push({
          type: ValidationErrorType.INVALID_SYNTAX,
          message: `Invalid subtag: ${subtag}`,
          subtag: subtag,
          position: normalizedTag.indexOf(subtag),
        });
        return { parsed: null, errors };
      }
    } else if (mode === "extension") {
      // Within an extension, must be a valid extension subtag
      if (SUBTAG_REGEX.EXTENSION.test(subtag)) {
        currentExtensionSubtags.push(subtag);
      } else if (SUBTAG_REGEX.SINGLETON.test(subtag)) {
        // A new singleton means we're starting a new extension

        // Ensure the previous extension had at least one subtag
        if (currentExtensionSubtags.length === 0) {
          errors.push({
            type: ValidationErrorType.INVALID_EXTENSION,
            message: `Extension singleton ${currentExtensionSingleton} must be followed by at least one extension subtag`,
            subtag: currentExtensionSingleton || "",
            subtagType: "extension",
            position: normalizedTag.indexOf(currentExtensionSingleton || ""),
          });
          return { parsed: null, errors };
        }

        // Store the previous extension
        if (currentExtensionSingleton) {
          if (!result.extensions) {
            result.extensions = {};
          }
          result.extensions[currentExtensionSingleton] =
            currentExtensionSubtags;
        }

        // Start the new extension
        if (seenExtensionSingletons.has(subtag)) {
          errors.push({
            type: ValidationErrorType.DUPLICATE_SINGLETON,
            message: `Duplicate extension singleton: ${subtag}`,
            subtag: subtag,
            subtagType: "extension",
            position: normalizedTag.indexOf(
              subtag,
              normalizedTag.indexOf(subtag) + 1
            ),
          });
          return { parsed: null, errors };
        }

        seenExtensionSingletons.add(subtag);
        currentExtensionSingleton = subtag;
        currentExtensionSubtags = [];
      } else {
        // Invalid extension subtag
        errors.push({
          type: ValidationErrorType.INVALID_EXTENSION,
          message: `Invalid extension subtag: ${subtag}`,
          subtag: subtag,
          subtagType: "extension",
          position: normalizedTag.indexOf(subtag),
        });
        return { parsed: null, errors };
      }
    }

    position++;
  }

  // Store any final extension
  if (mode === "extension" && currentExtensionSingleton) {
    // Ensure the extension had at least one subtag
    if (currentExtensionSubtags.length === 0) {
      errors.push({
        type: ValidationErrorType.INVALID_EXTENSION,
        message: `Extension singleton ${currentExtensionSingleton} must be followed by at least one extension subtag`,
        subtag: currentExtensionSingleton,
        subtagType: "extension",
        position: normalizedTag.lastIndexOf(currentExtensionSingleton),
      });
      return { parsed: null, errors };
    }

    if (!result.extensions) {
      result.extensions = {};
    }
    result.extensions[currentExtensionSingleton] = currentExtensionSubtags;
  }

  // Add extlangs if we found any
  if (extlangs.length > 0) {
    result.extlang = extlangs;
  }

  return { parsed: result, errors };
}
