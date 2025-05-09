# isWellFormed

The `isWellFormed` function is a utility that checks if a string follows the syntax rules for a BCP-47 language tag, without validating the subtags against registries.

## Signature

```typescript
function isWellFormed(tag: string): boolean;
```

## Description

`isWellFormed` checks only the syntax of a language tag, ensuring it follows the BCP-47 format rules. Unlike `isValid`, it does not verify that the subtags exist in their respective registries.

This function is useful when you only need to validate the structure of a tag, not whether the specific subtags are valid according to the ISO standards.

## Parameters

| Parameter | Type     | Required | Description                                   |
| --------- | -------- | -------- | --------------------------------------------- |
| `tag`     | `string` | Yes      | The language tag to check for syntax validity |

## Returns

- `true` if the tag follows BCP-47 syntax rules
- `false` if the tag has syntax errors

## Examples

```typescript
import { isWellFormed } from "ally-bcp-47";

// Well-formed tags (correct syntax)
isWellFormed("en"); // true
isWellFormed("en-US"); // true
isWellFormed("zh-Hans-CN"); // true
isWellFormed("de-AT-1996"); // true
isWellFormed("en-ZZ"); // true - ZZ isn't a valid region, but syntax is valid
isWellFormed("qq-Wxyz"); // true - subtags don't exist, but syntax is valid

// Malformed tags (incorrect syntax)
isWellFormed(""); // false - empty string
isWellFormed("en-"); // false - empty subtag
isWellFormed("en--US"); // false - double hyphen
isWellFormed("123"); // false - language must start with a letter
isWellFormed("en-US-"); // false - trailing hyphen
isWellFormed("en-u"); // false - singleton with no extension subtags
```

## Usage Notes

### When to Use

- When you only need to check the syntax of a language tag
- When validating user input before more detailed processing
- When working with custom subtags that might not exist in registries
- In performance-critical code where you want to avoid registry lookup overhead

### When to Use Other Functions Instead

- Use [`isValid`](/api/is-valid) when you need to validate both syntax and subtag validity
- Use [`validateLanguageTag`](/api/validate-language-tag) when you need detailed error information

## BCP-47 Syntax Rules

The `isWellFormed` function checks for several syntax rules, including:

1. Language tag must not be empty
2. No empty subtags (double hyphens)
3. No trailing hyphens
4. Language subtag must start with a letter
5. Subtags must be of the correct length for their position
6. Script subtags must be 4 letters
7. Region subtags must be 2 letters or 3 digits
8. Extension singletons must be followed by at least one subtag

## Related Functions

- [`isValid`](/api/is-valid) - For complete validation including registry checks
- [`validateLanguageTag`](/api/validate-language-tag) - For detailed validation results
- [`parseTag`](/api/parse-tag) - For parsing a tag into its components

## Implementation Details

```typescript
function isWellFormed(tag: string): boolean {
  const result = validateLanguageTag(tag, { checkRegistry: false });
  return result.isWellFormed;
}
```
