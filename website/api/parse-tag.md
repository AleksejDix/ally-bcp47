# parseTag

The `parseTag` function breaks down a BCP-47 language tag into its structural components, allowing you to access each subtag separately.

## Signature

```typescript
function parseTag(tag: string): LanguageTag | null;
```

## Description

`parseTag` analyzes a BCP-47 language tag and returns a structured object containing all of its components. This function only checks the syntax of the tag; it does not validate that the subtags exist in their respective registries.

If the tag is syntactically valid, the function returns a `LanguageTag` object. If the tag has syntax errors, it returns `null`.

## Parameters

| Parameter | Type     | Required | Description               |
| --------- | -------- | -------- | ------------------------- |
| `tag`     | `string` | Yes      | The language tag to parse |

## Returns

- A `LanguageTag` object if the tag is syntactically valid
- `null` if the tag has syntax errors

### LanguageTag Interface

```typescript
interface LanguageTag {
  tag: string; // The complete tag
  language: string; // Language subtag (e.g., "en", "fr")
  extlang?: string; // Extended language subtag (e.g., "cmn")
  script?: string; // Script subtag (e.g., "Latn", "Cyrl")
  region?: string; // Region subtag (e.g., "US", "DE")
  variants?: string[]; // Variant subtags (e.g., ["1996", "rozaj"])
  extensions?: {
    // Extension subtags
    [singleton: string]: string[]; // Key is singleton, value is array of subtags
  };
  privateuse?: string[]; // Private use subtags
  grandfathered?: boolean; // Whether this is a grandfathered tag
  irregular?: boolean; // Whether this is an irregular tag
}
```

## Examples

```typescript
import { parseTag } from "ally-bcp-47";

// Simple language tag
const simple = parseTag("en");
console.log(simple);
// {
//   tag: 'en',
//   language: 'en'
// }

// Language with region
const withRegion = parseTag("en-US");
console.log(withRegion);
// {
//   tag: 'en-US',
//   language: 'en',
//   region: 'US'
// }

// Complex tag with multiple components
const complex = parseTag("zh-Hans-CN-variant-u-co-pinyin-x-private");
console.log(complex);
// {
//   tag: 'zh-Hans-CN-variant-u-co-pinyin-x-private',
//   language: 'zh',
//   script: 'Hans',
//   region: 'CN',
//   variants: ['variant'],
//   extensions: {
//     u: ['co', 'pinyin']
//   },
//   privateuse: ['private']
// }

// Syntax error (returns null)
const invalid = parseTag("en--US");
console.log(invalid); // null
```

## Usage Notes

### When to Use

- When you need to extract specific components from a language tag
- When implementing custom language matching algorithms
- When filtering or grouping language tags by their components
- When you need to transform or manipulate language tags

### Handling Errors

Always check if the result is `null` before trying to access properties:

```typescript
const result = parseTag(userInput);
if (result === null) {
  console.error("Invalid language tag syntax");
} else {
  // Safe to use result properties
  console.log(`Language: ${result.language}`);
  if (result.region) {
    console.log(`Region: ${result.region}`);
  }
}
```

### Working with Extensions

Extension subtags are organized by their singleton character:

```typescript
const tag = parseTag("en-US-u-ca-gregory-nu-latn");
if (tag && tag.extensions && tag.extensions.u) {
  // Unicode extensions
  console.log(tag.extensions.u); // ['ca', 'gregory', 'nu', 'latn']

  // Get extension keys and values
  for (let i = 0; i < tag.extensions.u.length; i += 2) {
    const key = tag.extensions.u[i];
    const value = tag.extensions.u[i + 1] || "";
    console.log(`${key}: ${value}`);
  }
  // Output:
  // ca: gregory
  // nu: latn
}
```

## Combining with Validation

For complete validation and parsing, combine with `validateLanguageTag`:

```typescript
import { parseTag, validateLanguageTag } from "ally-bcp-47";

function getValidatedTag(input) {
  // First validate the tag
  const validationResult = validateLanguageTag(input);

  if (!validationResult.isValid) {
    console.error("Invalid tag:", validationResult.errors);
    return null;
  }

  // If valid, parseTag will never return null, but we use the validated tag
  return parseTag(input);
}

const tag = getValidatedTag("en-US");
// Use tag components safely
```

## Related Functions

- [`validateLanguageTag`](/api/validate-language-tag) - For validating a language tag
- [`isValid`](/api/is-valid) - For checking if a tag is valid
- [`isWellFormed`](/api/is-well-formed) - For checking syntax only
- [`canonicalizeTag`](/api/canonicalize-tag) - For normalizing a tag to canonical form
