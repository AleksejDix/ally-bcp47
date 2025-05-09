# Validation

This page details the validation capabilities of the `ally-bcp-47` library and how to use them.

<InteractiveTagBuilder />

## Validation Process

The library validates language tags in two key steps:

1. **Syntax Validation**: Checks if the tag follows the BCP-47 syntax rules
2. **Registry Validation**: Checks if the subtags exist in the official registries

## Validation Options

The `validateLanguageTag` function accepts options to customize validation:

```typescript
import { validateLanguageTag } from "ally-bcp-47";

const options = {
  checkRegistry: true, // Check subtags against registries
  warnOnDeprecated: true, // Generate warnings for deprecated subtags
  warnOnRedundantScript: true, // Generate warnings for redundant script subtags
};

const result = validateLanguageTag("en-US", options);
```

### Available Options

| Option                  | Type    | Default | Description                                                                   |
| ----------------------- | ------- | ------- | ----------------------------------------------------------------------------- |
| `checkRegistry`         | boolean | `true`  | Whether to validate subtags against registries (ISO 639, ISO 15924, ISO 3166) |
| `warnOnDeprecated`      | boolean | `true`  | Whether to generate warnings for deprecated subtags                           |
| `warnOnRedundantScript` | boolean | `true`  | Whether to generate warnings for redundant script subtags                     |

## Validation Results

The `validateLanguageTag` function returns a detailed result object:

```typescript
type ValidationResult = {
  isWellFormed: boolean; // Whether the tag follows BCP-47 syntax
  isValid: boolean; // Whether the tag is well-formed and all subtags exist
  tag?: LanguageTag; // Parsed tag (if well-formed)
  errors?: ValidationError[]; // Validation errors (if any)
  warnings?: ValidationWarning[]; // Validation warnings (if any)
};
```

### Error Types

The library generates different types of validation errors:

```typescript
export enum ValidationErrorType {
  MALFORMED_TAG = "malformed_tag", // General syntax error
  INVALID_SYNTAX = "invalid_syntax", // Specific syntax error
  UNKNOWN_SUBTAG = "unknown_subtag", // Subtag not in registry
  DUPLICATE_SUBTAG = "duplicate_subtag", // Subtag appears multiple times
  INVALID_ORDER = "invalid_order", // Subtags in wrong order
  UNKNOWN_SINGLETON = "unknown_singleton", // Unknown extension singleton
}
```

### Warning Types

The library also generates warnings for issues that don't make a tag invalid:

```typescript
export enum ValidationWarningType {
  DEPRECATED_SUBTAG = "deprecated_subtag", // Subtag is deprecated
  REDUNDANT_SCRIPT = "redundant_script", // Script is redundant
  DEPRECATED_EXTENSION = "deprecated_extension", // Extension is deprecated
}
```

## Validation Examples

### Basic Validation

```typescript
import { validateLanguageTag } from "ally-bcp-47";

// Valid tag
const result = validateLanguageTag("en-US");
console.log(result.isValid); // true
console.log(result.isWellFormed); // true

// Invalid tag (syntax error)
const syntaxError = validateLanguageTag("en--US");
console.log(syntaxError.isWellFormed); // false
console.log(syntaxError.errors);
// [{
//   type: 'invalid_syntax',
//   message: 'Double hyphen is not allowed in language tags'
// }]

// Invalid tag (unknown subtag)
const registryError = validateLanguageTag("en-ZZ");
console.log(registryError.isValid); // false
console.log(registryError.isWellFormed); // true
console.log(registryError.errors);
// [{
//   type: 'unknown_subtag',
//   message: 'Unknown region subtag: ZZ',
//   subtag: 'ZZ',
//   subtagType: 'region'
// }]
```

### Validation with Suggestions

The library provides suggestions for certain types of errors:

```typescript
// Common typo for the UK
const ukResult = validateLanguageTag("en-UK");
console.log(ukResult.isValid); // false
console.log(ukResult.errors);
// [{
//   type: 'unknown_subtag',
//   message: 'Unknown region subtag: UK',
//   subtag: 'UK',
//   subtagType: 'region',
//   suggestedReplacement: 'GB'
// }]

// Common language code typo
const chResult = validateLanguageTag("ch-DE");
console.log(chResult.isValid); // false
console.log(chResult.errors);
// [{
//   type: 'unknown_subtag',
//   message: 'Unknown language subtag: ch',
//   subtag: 'ch',
//   subtagType: 'language',
//   suggestedReplacement: 'zh'
// }]
```

### Syntax-Only Validation

If you only want to check if a tag follows the BCP-47 syntax (without registry validation):

```typescript
// Using validateLanguageTag with options
const syntaxResult = validateLanguageTag("en-ZZ", { checkRegistry: false });
console.log(syntaxResult.isWellFormed); // true
console.log(syntaxResult.isValid); // true (because we disabled registry validation)

// Using the isWellFormed convenience function
import { isWellFormed } from "ally-bcp-47";
console.log(isWellFormed("en-ZZ")); // true
```

### Registry-Only Validation

If you know a tag is syntactically valid and just want to check the registry:

```typescript
import { validateTagAgainstRegistry } from "ally-bcp-47/registry";

const registryResult = validateTagAgainstRegistry({
  language: "en",
  region: "ZZ",
});

console.log(registryResult.valid); // false
console.log(registryResult.problems);
// [{
//   type: 'unknown_region',
//   message: 'Unknown region subtag: ZZ',
//   subtag: 'ZZ',
//   subtagType: 'region'
// }]
```

### Convenience Functions

For simple validation cases, the library provides convenience functions:

```typescript
import { isValid, isWellFormed } from "ally-bcp-47";

// Check if a tag is valid (both well-formed and registry-valid)
console.log(isValid("en-US")); // true
console.log(isValid("en-ZZ")); // false
console.log(isValid("en--US")); // false

// Check if a tag is well-formed (syntax only)
console.log(isWellFormed("en-US")); // true
console.log(isWellFormed("en-ZZ")); // true
console.log(isWellFormed("en--US")); // false
```

## Next Steps

- [Parsing](./parsing) - Learn how to parse language tags into their components
- [Canonicalization](./canonicalization) - Learn how to normalize language tags
