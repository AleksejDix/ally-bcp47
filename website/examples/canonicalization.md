# Canonicalization Examples

This page demonstrates how to use the `canonicalizeTag` function to normalize BCP-47 language tags to their canonical form.

## Basic Canonicalization

The most common use case is to normalize the casing of language tags:

```typescript
import { canonicalizeTag } from "ally-bcp-47";

// Lowercase language codes
console.log(canonicalizeTag("EN")); // 'en'
console.log(canonicalizeTag("FR")); // 'fr'

// Uppercase region codes
console.log(canonicalizeTag("en-us")); // 'en-US'
console.log(canonicalizeTag("fr-ca")); // 'fr-CA'

// Capitalized script codes
console.log(canonicalizeTag("zh-hans-cn")); // 'zh-Hans-CN'
console.log(canonicalizeTag("sr-LATN-rs")); // 'sr-Latn-RS'
```

## Normalizing Complex Tags

Canonicalization works on all parts of a language tag:

```typescript
import { canonicalizeTag } from "ally-bcp-47";

// Complex tag with multiple components
const complexTag = "ZH-hAnS-cn-VARIANT-U-CA-GREGORY-X-PRIVATE";
console.log(canonicalizeTag(complexTag));
// Output: 'zh-Hans-CN-variant-u-ca-gregory-x-PRIVATE'

// Note that:
// - Language code 'ZH' is lowercased to 'zh'
// - Script code 'hAnS' is normalized to 'Hans'
// - Region code 'cn' is uppercased to 'CN'
// - Variant 'VARIANT' is lowercased to 'variant'
// - Extension singleton 'U' and keys 'CA', 'GREGORY' are lowercased
// - Private use subtags ('PRIVATE') preserve their case
```

## Canonicalization for Comparison

Canonicalization is essential when comparing language tags:

```typescript
import { canonicalizeTag } from "ally-bcp-47";

// These tags represent the same language but have different casing
const tag1 = "en-us";
const tag2 = "EN-US";
const tag3 = "eN-Us";

// Direct comparison would indicate they're different
console.log(tag1 === tag2); // false
console.log(tag1 === tag3); // false
console.log(tag2 === tag3); // false

// Canonicalized comparison shows they're equivalent
console.log(canonicalizeTag(tag1) === canonicalizeTag(tag2)); // true
console.log(canonicalizeTag(tag1) === canonicalizeTag(tag3)); // true
console.log(canonicalizeTag(tag2) === canonicalizeTag(tag3)); // true
```

## Canonicalizing User Input

When accepting language tags from user input, canonicalization ensures consistency:

```typescript
import { canonicalizeTag, isValid } from "ally-bcp-47";

function processUserLanguagePreference(userInput) {
  // First check if the input is valid
  if (!isValid(userInput)) {
    return { error: "Invalid language tag" };
  }

  // Canonicalize to ensure consistent format
  const canonicalTag = canonicalizeTag(userInput);

  // Store or use the canonical form
  saveUserPreference(canonicalTag);

  return { success: true, tag: canonicalTag };
}

// Example usage
console.log(processUserLanguagePreference("en-us"));
// Output: { success: true, tag: 'en-US' }

console.log(processUserLanguagePreference("FR-ca"));
// Output: { success: true, tag: 'fr-CA' }

console.log(processUserLanguagePreference("not-valid"));
// Output: { error: 'Invalid language tag' }
```

## Building a Language Lookup System

Canonicalization is crucial when implementing a language tag lookup system:

```typescript
import { canonicalizeTag, isValid } from "ally-bcp-47";

class LanguageTagMap {
  private store = new Map();

  // Add a value associated with a language tag
  set(tag, value) {
    if (!isValid(tag)) {
      throw new Error(`Invalid language tag: ${tag}`);
    }
    // Always store with canonical form
    const canonicalTag = canonicalizeTag(tag);
    this.store.set(canonicalTag, value);
    return this;
  }

  // Get a value by language tag
  get(tag) {
    if (!isValid(tag)) {
      return undefined;
    }
    // Look up using canonical form
    const canonicalTag = canonicalizeTag(tag);
    return this.store.get(canonicalTag);
  }

  // Check if a language tag exists
  has(tag) {
    if (!isValid(tag)) {
      return false;
    }
    // Check using canonical form
    const canonicalTag = canonicalizeTag(tag);
    return this.store.has(canonicalTag);
  }
}

// Example usage
const languageData = new LanguageTagMap();

// Add data with different casing
languageData.set("en-US", { name: "English (US)", direction: "ltr" });
languageData.set("ar-EG", { name: "Arabic (Egypt)", direction: "rtl" });

// Retrieve using different casing
console.log(languageData.get("EN-us"));
// Output: { name: 'English (US)', direction: 'ltr' }

console.log(languageData.has("AR-eg"));
// Output: true
```

## Handling HTML Lang Attributes

Canonicalization helps ensure correct `lang` attributes in HTML:

```typescript
import { canonicalizeTag, isValid } from "ally-bcp-47";

function normalizeHtmlLangAttributes() {
  // Get all elements with lang attributes
  const elementsWithLang = document.querySelectorAll("[lang]");

  elementsWithLang.forEach((element) => {
    const langAttr = element.getAttribute("lang");

    if (isValid(langAttr)) {
      // Set the canonical form
      const canonicalLang = canonicalizeTag(langAttr);
      element.setAttribute("lang", canonicalLang);
    } else {
      console.warn(`Invalid lang attribute found: ${langAttr}`);
      // Optionally remove or fix invalid attributes
    }
  });
}

// Usage in a web application
document.addEventListener("DOMContentLoaded", normalizeHtmlLangAttributes);
```

## Special Cases and Edge Cases

Understanding how canonicalization handles edge cases:

```typescript
import { canonicalizeTag, isWellFormed } from "ally-bcp-47";

// Grandfathered tags
console.log(canonicalizeTag("i-navajo")); // 'i-navajo' (preserved as-is)
console.log(canonicalizeTag("i-NAVAJO")); // 'i-navajo' (normalized)

// Invalid syntax - returns original
console.log(canonicalizeTag("en--us")); // 'en--us' (invalid syntax, returned as-is)

// Non-existent but well-formed tags
console.log(canonicalizeTag("xx-YY")); // 'xx-YY' (normalized but doesn't exist)

// Empty tag
console.log(canonicalizeTag("")); // '' (empty string returned as-is)

// Function to safely canonicalize
function safelyCanonicalize(tag) {
  if (!isWellFormed(tag)) {
    return { error: "Malformed tag", original: tag };
  }
  return { canonical: canonicalizeTag(tag) };
}

console.log(safelyCanonicalize("en-US")); // { canonical: 'en-US' }
console.log(safelyCanonicalize("en--US")); // { error: 'Malformed tag', original: 'en--US' }
```

## Integration with Other API Functions

Combining canonicalization with other library functions:

```typescript
import { canonicalizeTag, parseTag, validateLanguageTag } from "ally-bcp-47";

function processLanguageTag(tag) {
  // Step 1: Validate the tag
  const validationResult = validateLanguageTag(tag);

  if (!validationResult.isValid) {
    return {
      valid: false,
      errors: validationResult.errors,
      original: tag,
    };
  }

  // Step 2: Canonicalize the tag
  const canonicalTag = canonicalizeTag(tag);

  // Step 3: Parse the canonical form
  const parsedTag = parseTag(canonicalTag);

  return {
    valid: true,
    original: tag,
    canonical: canonicalTag,
    parsed: parsedTag,
  };
}

// Example usage
console.log(processLanguageTag("EN-us"));
/* Output:
{
  valid: true,
  original: 'EN-us',
  canonical: 'en-US',
  parsed: {
    tag: 'en-US',
    language: 'en',
    region: 'US'
  }
}
*/

console.log(processLanguageTag("zh-hans-CN"));
/* Output:
{
  valid: true,
  original: 'zh-hans-CN',
  canonical: 'zh-Hans-CN',
  parsed: {
    tag: 'zh-Hans-CN',
    language: 'zh',
    script: 'Hans',
    region: 'CN'
  }
}
*/
```

## Conclusion

Canonicalization of language tags is essential for:

1. **Consistency** - Ensuring uniform formatting in your application
2. **Comparison** - Enabling accurate equality checks between tags
3. **Storage** - Maintaining a consistent format in databases and APIs
4. **User Interface** - Displaying language tags in a standardized way
5. **Accessibility** - Ensuring correct `lang` attributes in HTML

The `canonicalizeTag` function simplifies the process of normalizing tags according to the BCP-47 standard, making your language-handling code more robust and consistent.

For more information, see the [`canonicalizeTag` API documentation](/api/canonicalize-tag).
