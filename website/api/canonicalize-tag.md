# canonicalizeTag

The `canonicalizeTag` function normalizes a BCP-47 language tag to its canonical form according to the standard's rules for case and formatting.

## Signature

```typescript
function canonicalizeTag(tag: string): string;
```

## Description

`canonicalizeTag` converts a language tag to its canonical form as defined by BCP-47. This ensures consistent formatting when storing, comparing, or displaying language tags. The function applies several normalization rules, including:

- Converting language subtags to lowercase
- Capitalizing the first letter of script subtags
- Converting region subtags to uppercase
- Normalizing casing of variant and extension subtags

If the input tag is not well-formed, the function will return the original tag unchanged.

## Parameters

| Parameter | Type     | Required | Description                                   |
| --------- | -------- | -------- | --------------------------------------------- |
| `tag`     | `string` | Yes      | The language tag to convert to canonical form |

## Returns

- A string containing the language tag in its canonical form
- If the tag is not well-formed, returns the original tag unchanged

## Examples

```typescript
import { canonicalizeTag } from "ally-bcp-47";

// Lowercase language codes
canonicalizeTag("EN"); // 'en'
canonicalizeTag("EN-us"); // 'en-US'

// Capitalized script codes
canonicalizeTag("zh-hans-cn"); // 'zh-Hans-CN'
canonicalizeTag("sr-latn"); // 'sr-Latn'

// Uppercase region codes
canonicalizeTag("en-us"); // 'en-US'
canonicalizeTag("es-mx"); // 'es-MX'

// Mixed case normalization
canonicalizeTag("de-AT-1996"); // 'de-AT-1996'
canonicalizeTag("en-US-u-CA-GREGORY"); // 'en-US-u-ca-gregory'

// Preserving well-structured but invalid tags
canonicalizeTag("xx-YY"); // 'xx-YY' (both subtags don't exist but format is valid)

// Invalid tags remain unchanged
canonicalizeTag("en--us"); // 'en--us' (invalid syntax)
```

## Usage Notes

### When to Use

- Before storing language tags in a database
- When comparing language tags for equality
- When displaying language tags to users
- When implementing language matching algorithms
- Before sending language tags to external APIs or services

### Combining with Validation

For complete validation and canonicalization, combine with `validateLanguageTag`:

```typescript
import { canonicalizeTag, validateLanguageTag } from "ally-bcp-47";

function normalizeLanguageTag(input) {
  const validationResult = validateLanguageTag(input);

  if (!validationResult.isWellFormed) {
    console.error("Invalid tag format:", input);
    return null;
  }

  return canonicalizeTag(input);
}

// Usage
const normalized = normalizeLanguageTag("en-us"); // 'en-US'
const error = normalizeLanguageTag("en--us"); // null (invalid syntax)
```

## Canonicalization Rules

BCP-47 defines specific rules for the canonical format of tags:

1. **Language Subtags**: Lowercase (e.g., `en`, not `EN`)
2. **Script Subtags**: First letter uppercase, rest lowercase (e.g., `Latn`, not `latn` or `LATN`)
3. **Region Subtags**: Uppercase (e.g., `US`, not `us` or `Us`)
4. **Variant Subtags**: Typically lowercase, but may contain uppercase if registered that way
5. **Extension Subtags**: Lowercase, including the singleton (e.g., `u-co-phonebk`, not `U-CO-PHONEBK`)
6. **Private Use Subtags**: No case modification (case is preserved as-is)

## Equivalent Representations

Canonicalization ensures that equivalent tags are represented consistently:

```typescript
// These are equivalent but have different casing
const tag1 = "en-us";
const tag2 = "EN-US";
const tag3 = "eN-Us";

// After canonicalization, they're all the same
console.log(canonicalizeTag(tag1)); // 'en-US'
console.log(canonicalizeTag(tag2)); // 'en-US'
console.log(canonicalizeTag(tag3)); // 'en-US'

// This allows for proper comparison
console.log(canonicalizeTag(tag1) === canonicalizeTag(tag2)); // true
```

## Related Functions

- [`validateLanguageTag`](/api/validate-language-tag) - For validating a language tag
- [`parseTag`](/api/parse-tag) - For breaking a tag down into its components
- [`isValid`](/api/is-valid) - For checking if a tag is valid
- [`isWellFormed`](/api/is-well-formed) - For checking syntax only
