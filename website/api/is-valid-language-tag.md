# isValidLanguageTag

A simplified function that checks if a string follows the basic BCP-47 language tag pattern.

## Signature

```typescript
function isValidLanguageTag(tag: string): boolean;
```

## Description

`isValidLanguageTag` performs a basic validation of BCP-47 language tags using a regular expression. This function is simpler and faster than the full `validateLanguageTag` function, but provides less thorough validation.

**Note:** This function uses a simplified validation approach and does not check against the registry. For complete validation, use `validateLanguageTag` or `isValid` instead.

## Parameters

| Parameter | Type     | Required | Description                  |
| --------- | -------- | -------- | ---------------------------- |
| `tag`     | `string` | Yes      | The language tag to validate |

## Returns

- `true` if the tag matches the basic BCP-47 language tag pattern
- `false` if the tag does not match the pattern

## Examples

```typescript
import { isValidLanguageTag } from "@aleksejdix/ally-bcp47";

// Basic valid tags
isValidLanguageTag("en"); // true
isValidLanguageTag("en-US"); // true
isValidLanguageTag("zh-Hans-CN"); // true

// Invalid tags
isValidLanguageTag(""); // false - empty string
isValidLanguageTag("en-"); // false - ends with hyphen
isValidLanguageTag("123"); // false - must start with a letter
```

## Validation Pattern

This function uses the following regular expression pattern for validation:

```regex
/^[a-z]{2,3}(-[A-Z][a-z]{3})?(-[A-Z]{2}|-[0-9]{3})?(-[A-Z0-9]{5,8})?(-[a-z0-9]{1,8})*$/
```

This pattern matches:

- A language code of 2-3 lowercase letters
- Optionally followed by a script code (capitalized first letter followed by 3 lowercase letters)
- Optionally followed by a region code (2 uppercase letters or 3 digits)
- Optionally followed by a variant subtag (5-8 alphanumeric characters)
- Optionally followed by any number of extension subtags (1-8 alphanumeric characters)

## Implementation

```typescript
function isValidLanguageTag(tag: string): boolean {
  const bcp47Regex =
    /^[a-z]{2,3}(-[A-Z][a-z]{3})?(-[A-Z]{2}|-[0-9]{3})?(-[A-Z0-9]{5,8})?(-[a-z0-9]{1,8})*$/;
  return bcp47Regex.test(tag);
}
```

## Usage Notes

### When to Use

- For simple, fast validations where precision isn't critical
- For quick filtering of obviously invalid values
- When you don't need registry validation

### When to Use Other Functions Instead

- For complete validation: use `validateLanguageTag` or `isValid`
- For parsing the tag components: use `parseTag`
- For BCP-47 syntax validation only: use `isWellFormed`

## Related Functions

- [`validateLanguageTag`](/api/validate-language-tag) - For comprehensive validation
- [`isValid`](/api/is-valid) - For complete validation with a boolean result
- [`isWellFormed`](/api/is-well-formed) - For syntax-only validation
- [`parseTag`](/api/parse-tag) - For parsing a tag into its components
