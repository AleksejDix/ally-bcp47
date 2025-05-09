# isValid

The `isValid` function is a simple utility that checks if a string is a valid BCP-47 language tag according to both syntax rules and registry validation.

## Signature

```typescript
function isValid(tag: string, options?: ValidationOptions): boolean;
```

## Description

`isValid` provides a convenient way to perform a complete validation of a BCP-47 language tag. It returns a boolean result indicating whether the tag is valid, rather than the detailed result object that `validateLanguageTag` returns.

Internally, this function calls `validateLanguageTag` and returns its `isValid` property.

## Parameters

| Parameter | Type                | Required | Description                     |
| --------- | ------------------- | -------- | ------------------------------- |
| `tag`     | `string`            | Yes      | The language tag to validate    |
| `options` | `ValidationOptions` | No       | Options for validation behavior |

### ValidationOptions

| Option                  | Type      | Default | Description                                               |
| ----------------------- | --------- | ------- | --------------------------------------------------------- |
| `checkRegistry`         | `boolean` | `true`  | Whether to validate subtags against registries            |
| `warnOnDeprecated`      | `boolean` | `true`  | Whether to generate warnings for deprecated subtags       |
| `warnOnRedundantScript` | `boolean` | `true`  | Whether to generate warnings for redundant script subtags |

## Returns

- `true` if the tag is both syntactically well-formed and all subtags exist in their respective registries
- `false` if the tag is malformed or contains unknown subtags

## Examples

```typescript
import { isValid } from "ally-bcp-47";

// Valid language tags
isValid("en"); // true
isValid("en-US"); // true
isValid("zh-Hans-CN"); // true
isValid("de-AT-1996"); // true

// Invalid due to syntax errors
isValid("en-"); // false - empty subtag
isValid("en--US"); // false - double hyphen
isValid("123"); // false - language must start with a letter

// Invalid due to registry errors
isValid("en-ZZ"); // false - ZZ is not a valid region code
isValid("qq"); // false - qq is not a valid language code
isValid("en-Wxyz"); // false - Wxyz is not a valid script code

// Syntax-only validation
isValid("en-ZZ", { checkRegistry: false }); // true - valid syntax, registry validation disabled
```

## Usage Notes

### When to Use

- Use `isValid` when you need a simple boolean validation result
- Perfect for validation in form inputs, data import checks, or UI feedback
- Use when you don't need detailed error information

### When to Use `validateLanguageTag` Instead

- When you need to know why a tag is invalid
- When you need to access the parsed tag components
- When you want to collect warnings as well as errors

## Related Functions

- [`validateLanguageTag`](/api/validate-language-tag) - For detailed validation results
- [`isWellFormed`](/api/is-well-formed) - For syntax-only validation
- [`parseTag`](/api/parse-tag) - For parsing a tag into its components

## Implementation Details

```typescript
function isValid(tag: string, options?: ValidationOptions): boolean {
  const result = validateLanguageTag(tag, options);
  return result.isValid;
}
```
