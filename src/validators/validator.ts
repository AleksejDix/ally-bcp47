import {
  LanguageTag,
  ValidationError,
  ValidationErrorType,
  ValidationOptions,
  ValidationResult,
  ValidationWarning,
  ValidationWarningType,
} from "../types/index.js";
import { LANGUAGE_TAG_REGEX } from "../utils/constants.js";
import { parseLanguageTag } from "./parser.js";
import { validateTagAgainstRegistry, normalizeTag } from "../registry/index.js";

/**
 * Default validation options
 */
const DEFAULT_VALIDATION_OPTIONS: ValidationOptions = {
  checkRegistry: true,
  warnOnDeprecated: true,
  warnOnRedundantScript: true,
};

/**
 * Validates a language tag against the BCP-47 specification
 *
 * @param tag The language tag to validate
 * @param options Validation options
 * @returns Validation result
 */
export function validateLanguageTag(
  tag: string,
  options: ValidationOptions = {}
): ValidationResult {
  // Merge options with defaults
  const opts = { ...DEFAULT_VALIDATION_OPTIONS, ...options };

  // Initial quick check with regex
  const isQuickMatch = LANGUAGE_TAG_REGEX.test(tag);

  // Quick fail for obviously malformed tags
  if (!isQuickMatch) {
    return {
      isWellFormed: false,
      isValid: false,
      errors: [
        {
          type: ValidationErrorType.MALFORMED_TAG,
          message: `Language tag "${tag}" does not match the BCP-47 syntax`,
        },
      ],
    };
  }

  // Parse the tag
  const { parsed, errors } = parseLanguageTag(tag);

  // If parsing failed, return the errors
  if (!parsed) {
    return {
      isWellFormed: false,
      isValid: false,
      errors,
    };
  }

  // Collect errors and warnings
  const syntaxErrors = [...errors];
  const registryErrors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // If registry checking is enabled, validate against the registry
  if (opts.checkRegistry && parsed) {
    const registryValidation = validateTagAgainstRegistry(parsed);

    if (!registryValidation.valid) {
      for (const problem of registryValidation.problems) {
        registryErrors.push({
          type: ValidationErrorType.UNKNOWN_SUBTAG,
          message: problem.message,
          subtag: problem.subtag,
          subtagType: problem.subtagType as any,
          suggestedReplacement: problem.suggestedReplacement,
        });
      }
    }
  }

  // Normalize the tag to canonical form
  if (parsed && parsed.tag) {
    // Store the original parsed tag
    const originalTag = parsed.tag;

    // Normalize to canonical form
    const normalizedTag = normalizeTag(originalTag);

    // Update the tag in the parsed result
    parsed.tag = normalizedTag;
  }

  // Determine if the tag is well-formed and valid
  const isWellFormed = syntaxErrors.length === 0;
  const isValid = isWellFormed && registryErrors.length === 0;

  // Combine all errors
  const allErrors = [...syntaxErrors, ...registryErrors];

  return {
    isWellFormed,
    isValid,
    tag: parsed,
    errors: allErrors.length > 0 ? allErrors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Checks if a language tag is well-formed according to BCP-47 syntax rules
 *
 * @param tag The language tag to check
 * @returns True if the tag is well-formed, false otherwise
 */
export function isWellFormed(tag: string): boolean {
  const result = validateLanguageTag(tag, { checkRegistry: false });
  return result.isWellFormed;
}

/**
 * Checks if a language tag is valid (well-formed and all subtags exist in registry)
 *
 * @param tag The language tag to check
 * @returns True if the tag is valid, false otherwise
 */
export function isValid(tag: string): boolean {
  const result = validateLanguageTag(tag, { checkRegistry: true });
  return result.isValid;
}

/**
 * Parses a language tag string into its component parts without validation
 *
 * @param tag The language tag to parse
 * @returns The parsed language tag or null if parsing fails
 */
export function parseTag(tag: string): LanguageTag | null {
  const { parsed } = parseLanguageTag(tag);
  return parsed;
}

/**
 * Canonicalizes a language tag to its canonical form
 *
 * @param tag The language tag to canonicalize
 * @returns The canonicalized tag or null if the tag is invalid
 */
export function canonicalizeTag(tag: string): string | null {
  const result = validateLanguageTag(tag);
  if (!result.isWellFormed || !result.tag) {
    return null;
  }
  return result.tag.tag;
}
