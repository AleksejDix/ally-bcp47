# validateLanguageTag

The core function of the library that provides comprehensive validation of BCP-47 language tags.

## Syntax

```typescript
function validateLanguageTag(
  tag: string,
  options?: ValidationOptions
): ValidationResult;
```

## Parameters

### tag

The language tag string to validate.

- **Type:** `string`
- **Required:** Yes

### options

Configuration options for the validation process.

- **Type:** `ValidationOptions`
- **Required:** No
- **Default:** `{ checkRegistry: true, warnOnDeprecated: true, warnOnRedundantScript: true }`

#### ValidationOptions

| Property                | Type    | Default | Description                                          |
| ----------------------- | ------- | ------- | ---------------------------------------------------- |
| `checkRegistry`         | boolean | `true`  | Whether to validate subtags against their registries |
| `warnOnDeprecated`      | boolean | `true`  | Whether to generate warnings for deprecated subtags  |
| `warnOnRedundantScript` | boolean | `true`  | Whether to warn about redundant script subtags       |

## Return Value

Returns a `ValidationResult` object:

```typescript
type ValidationResult = {
  isWellFormed: boolean; // Whether the tag follows BCP-47 syntax
  isValid: boolean; // Whether the tag is well-formed and all subtags exist
  tag?: LanguageTag; // Parsed tag (if well-formed)
  errors?: ValidationError[]; // Validation errors (if any)
  warnings?: ValidationWarning[]; // Validation warnings (if any)
};
```

### LanguageTag

The parsed and canonicalized language tag structure:

```typescript
type LanguageTag = {
  tag?: string; // The full tag (canonicalized)
  language?: string; // The language subtag
  extlang?: string[]; // Extended language subtags
  script?: string; // The script subtag
  region?: string; // The region subtag
  variants?: string[]; // Variant subtags
  extensions?: Record<string, string[]>; // Extension subtags
  privateuse?: string[]; // Private use subtags
  grandfathered?: boolean; // Whether this is a grandfathered tag
};
```

### ValidationError

Describes an error found during validation:

```typescript
type ValidationError = {
  type: ValidationErrorType; // The type of error
  message: string; // Human-readable error message
  subtag?: string; // The problematic subtag (if applicable)
  subtagType?: string; // The type of subtag (if applicable)
  position?: number; // Position in the tag (if applicable)
  suggestedReplacement?: string; // Suggested correction (if available)
};
```

### ValidationWarning

Describes a warning (non-critical issue) found during validation:

```typescript
type ValidationWarning = {
  type: ValidationWarningType; // The type of warning
  message: string; // Human-readable warning message
  subtag?: string; // The problematic subtag (if applicable)
  subtagType?: string; // The type of subtag (if applicable)
  suggestedReplacement?: string; // Suggested correction (if available)
};
```

## Examples

### Basic Validation

```typescript
import { validateLanguageTag } from "ally-bcp-47";

// Valid tag
const result = validateLanguageTag("en-US");
console.log(result.isValid); // true
console.log(result.isWellFormed); // true
console.log(result.tag); // { tag: 'en-US', language: 'en', region: 'us' }

// Invalid tag (unknown region)
const invalidResult = validateLanguageTag("en-ZZ");
console.log(invalidResult.isValid); // false
console.log(invalidResult.isWellFormed); // true
console.log(invalidResult.errors);
// [{
//   type: 'unknown_subtag',
//   message: 'Unknown region subtag: ZZ',
//   subtag: 'ZZ',
//   subtagType: 'region'
// }]
```

### Validation with Options

```typescript
import { validateLanguageTag } from "ally-bcp-47";

// Skip registry validation
const syntaxOnlyResult = validateLanguageTag("en-ZZ", {
  checkRegistry: false,
});
console.log(syntaxOnlyResult.isValid); // true
console.log(syntaxOnlyResult.isWellFormed); // true

// Turn off warnings
const noWarningsResult = validateLanguageTag("ja-Jpan", {
  warnOnRedundantScript: false,
});
console.log(noWarningsResult.warnings); // undefined (no warnings generated)
```

### Working with Validation Results

```typescript
import { validateLanguageTag } from "ally-bcp-47";

function processLanguageTag(tag) {
  const result = validateLanguageTag(tag);

  if (!result.isWellFormed) {
    return {
      valid: false,
      message: "Malformed language tag",
      errors: result.errors,
    };
  }

  if (!result.isValid) {
    return {
      valid: false,
      message: "Invalid language tag",
      errors: result.errors,
    };
  }

  // Handle warnings if any
  if (result.warnings && result.warnings.length > 0) {
    console.warn("Warnings for tag", tag, result.warnings);
  }

  return {
    valid: true,
    canonicalForm: result.tag.tag,
    parsedTag: result.tag,
  };
}
```

## Notes

- The validation process includes both syntax checking and registry validation
- Registry validation checks each subtag against the relevant registry (ISO 639, ISO 15924, ISO 3166)
- The parsed tag is automatically canonicalized (case normalized, preferred values substituted)
- This function is the most comprehensive validation option and is recommended for most use cases

## See Also

- [isValid](/api/is-valid) - Simplified validation function
- [isWellFormed](/api/is-well-formed) - Syntax-only validation
- [parseTag](/api/parse-tag) - Parse a tag without validation
- [canonicalizeTag](/api/canonicalize-tag) - Normalize a tag to its canonical form
