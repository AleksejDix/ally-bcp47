/**
 * Types for the BCP-47 language tag library
 */

/**
 * Represents the various subtag types in a BCP-47 language tag
 */
export type SubtagType =
  | "language" // Primary language subtag (e.g., 'en', 'fr')
  | "extlang" // Extended language subtag (e.g., 'cmn')
  | "script" // Script subtag (e.g., 'Latn', 'Cyrl')
  | "region" // Region subtag (e.g., 'US', '001')
  | "variant" // Variant subtag (e.g., '1996')
  | "extension" // Extension subtag (e.g., 'u-ca-gregory')
  | "privateuse" // Private use subtag (e.g., 'x-private')
  | "grandfathered" // Grandfathered tag (e.g., 'i-default')
  | "redundant"; // Redundant tag (e.g., 'zh-cmn')

/**
 * Represents the scope of a language tag as defined in the registry
 */
export type LanguageScope =
  | "macrolanguage" // A language that encompasses other languages
  | "collection" // A collection of languages
  | "special" // Special purpose codes
  | "private-use" // Private use codes
  | "individual"; // An individual language (default)

/**
 * Represents a language tag after parsing
 */
export interface LanguageTag {
  /** The original tag string */
  tag: string;

  /** Primary language subtag */
  language?: string;

  /** Extended language subtags */
  extlang?: string[];

  /** Script subtag */
  script?: string;

  /** Region subtag */
  region?: string;

  /** Variant subtags */
  variants?: string[];

  /** Extension subtags - key is singleton character, value is array of extension subtags */
  extensions?: Record<string, string[]>;

  /** Private use subtags */
  privateuse?: string[];

  /** Whether this is a grandfathered tag */
  grandfathered?: boolean;

  /** Whether this is a private use only tag (starting with 'x-') */
  privateUseOnly?: boolean;

  /** Whether this is a redundant tag */
  redundant?: boolean;
}

/**
 * Validation result for a language tag
 */
export interface ValidationResult {
  /** Whether the tag is well-formed according to BCP-47 syntax rules */
  isWellFormed: boolean;

  /** Whether the tag is valid (well-formed and all subtags exist in registry) */
  isValid: boolean;

  /** Parsed language tag */
  tag?: LanguageTag;

  /** Validation errors, if any */
  errors?: ValidationError[];

  /** Warnings about the tag, if any */
  warnings?: ValidationWarning[];
}

/**
 * Validation error types
 */
export enum ValidationErrorType {
  INVALID_SYNTAX = "invalid_syntax",
  UNKNOWN_SUBTAG = "unknown_subtag",
  DUPLICATE_VARIANT = "duplicate_variant",
  DUPLICATE_SINGLETON = "duplicate_singleton",
  INVALID_ORDER = "invalid_order",
  INVALID_PRIVATE_USE = "invalid_private_use",
  UNKNOWN_GRANDFATHERED = "unknown_grandfathered",
  MALFORMED_TAG = "malformed_tag",
  INVALID_EXTENSION = "invalid_extension",
}

/**
 * Validation warning types
 */
export enum ValidationWarningType {
  DEPRECATED_SUBTAG = "deprecated_subtag",
  DEPRECATED_TAG = "deprecated_tag",
  REDUNDANT_SCRIPT = "redundant_script",
  LIKELY_SUBTAG_MISMATCH = "likely_subtag_mismatch",
}

/**
 * Represents a validation error for a language tag
 */
export interface ValidationError {
  /** The type of error */
  type: ValidationErrorType;

  /** Human-readable error message */
  message: string;

  /** The subtag or part causing the error, if applicable */
  subtag?: string;

  /** The subtag type, if applicable */
  subtagType?: SubtagType;

  /** Position in the original tag where the error occurred */
  position?: number;

  /** Suggested replacement for the incorrect subtag, if available */
  suggestedReplacement?: string;
}

/**
 * Represents a validation warning for a language tag
 */
export interface ValidationWarning {
  /** The type of warning */
  type: ValidationWarningType;

  /** Human-readable warning message */
  message: string;

  /** The subtag or part causing the warning, if applicable */
  subtag?: string;

  /** The subtag type, if applicable */
  subtagType?: SubtagType;

  /** Suggested replacement, if applicable */
  suggestedReplacement?: string;
}

/**
 * Options for tag validation
 */
export interface ValidationOptions {
  /** Whether to validate against the registry (default: true) */
  checkRegistry?: boolean;

  /** Whether to return warnings for deprecated subtags (default: true) */
  warnOnDeprecated?: boolean;

  /** Whether to return warnings for redundant scripts (default: true) */
  warnOnRedundantScript?: boolean;
}

/**
 * Registry record types
 */
export type RegistryRecordType =
  | "language"
  | "extlang"
  | "script"
  | "region"
  | "variant"
  | "grandfathered"
  | "redundant";

/**
 * Base interface for all registry records
 */
export interface BaseRegistryRecord {
  /** The type of record */
  type: RegistryRecordType;

  /** The date the record was added to the registry */
  added: string;

  /** The date the record was deprecated, if applicable */
  deprecated?: string;

  /** Description of the subtag or tag */
  description: string[];

  /** Comments about the subtag or tag */
  comments?: string[];
}

/**
 * Interface for subtag records in the registry
 */
export interface SubtagRecord extends BaseRegistryRecord {
  /** The subtag value */
  subtag: string;

  /** The preferred value for this subtag, if deprecated */
  preferredValue?: string;

  /** The prefix(es) for this subtag, for variants and extlangs */
  prefix?: string[];
}

/**
 * Interface for language subtag records
 */
export interface LanguageRecord extends SubtagRecord {
  type: "language";

  /** The script that should be suppressed, if any */
  suppressScript?: string;

  /** The macrolanguage this language is a part of, if any */
  macrolanguage?: string;

  /** The scope of this language */
  scope?: LanguageScope;
}

/**
 * Interface for extended language subtag records
 */
export interface ExtlangRecord extends SubtagRecord {
  type: "extlang";

  /** The preferred value (always identical to subtag) */
  preferredValue: string;

  /** The prefix (always a single value, the macrolanguage) */
  prefix: string[];

  /** The macrolanguage this extlang is a part of */
  macrolanguage?: string;

  /** The scope of this extended language */
  scope?: LanguageScope;
}

/**
 * Interface for script subtag records
 */
export interface ScriptRecord extends SubtagRecord {
  type: "script";
}

/**
 * Interface for region subtag records
 */
export interface RegionRecord extends SubtagRecord {
  type: "region";
}

/**
 * Interface for variant subtag records
 */
export interface VariantRecord extends SubtagRecord {
  type: "variant";

  /** The prefix(es) for this variant (required) */
  prefix: string[];
}

/**
 * Interface for grandfathered and redundant tag records
 */
export interface TagRecord extends BaseRegistryRecord {
  type: "grandfathered" | "redundant";

  /** The tag value */
  tag: string;

  /** The preferred value for this tag, if any */
  preferredValue?: string;
}

/**
 * Union type for all registry record types
 */
export type RegistryRecord =
  | LanguageRecord
  | ExtlangRecord
  | ScriptRecord
  | RegionRecord
  | VariantRecord
  | TagRecord;
