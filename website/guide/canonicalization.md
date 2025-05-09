# Canonicalization

Canonicalization is the process of converting a language tag to its preferred form according to the BCP-47 standard. The `ally-bcp-47` library provides robust canonicalization capabilities.

## What is Canonicalization?

Canonicalization ensures that language tags:

1. Follow consistent casing rules
2. Use preferred subtags instead of deprecated ones
3. Remove redundant information
4. Follow a standard order

## Basic Canonicalization

The simplest way to canonicalize a tag is using the `canonicalizeTag` function:

```typescript
import { canonicalizeTag } from "ally-bcp-47";

// Case normalization
console.log(canonicalizeTag("en-us")); // 'en-US'
console.log(canonicalizeTag("ZH-hans-cn")); // 'zh-Hans-CN'

// Redundant script removal
console.log(canonicalizeTag("en-Latn-US")); // 'en-US'

// Preferred tag substitution
console.log(canonicalizeTag("i-navajo")); // 'nv'
console.log(canonicalizeTag("zh-cmn-Hans-CN")); // 'zh-Hans-CN'
```

## Case Normalization Rules

BCP-47 defines specific case rules for different subtag types:

- Language subtags: lowercase (`en`, not `EN`)
- Script subtags: titlecase (`Latn`, not `latn` or `LATN`)
- Region subtags: uppercase (`US`, not `us` or `Us`)
- Variant subtags: lowercase
- Extension singletons: lowercase
- Extension values: lowercase

```typescript
import { canonicalizeTag } from "ally-bcp-47";

// Mixed case tag
const mixedCase = "eN-lATn-uS";
console.log(canonicalizeTag(mixedCase)); // 'en-Latn-US'
```

## Redundant Script Suppression

Some language tags have a "suppress-script" value defined in the registry. This means that the script is obvious from the language itself and can be omitted:

```typescript
import { canonicalizeTag } from "ally-bcp-47";

// English is implicitly written in Latin script
console.log(canonicalizeTag("en-Latn")); // 'en'

// Japanese is implicitly written in Japanese script
console.log(canonicalizeTag("ja-Jpan")); // 'ja'

// Chinese requires a script code as there is no default
console.log(canonicalizeTag("zh-Hans")); // 'zh-Hans'
```

## Extension Canonicalization

Extensions are sorted by their singleton and their values are sorted:

```typescript
import { canonicalizeTag } from "ally-bcp-47";

// Extensions are reordered by singleton
console.log(canonicalizeTag("en-z-abc-u-ca-gregory")); // 'en-u-ca-gregory-z-abc'

// Extension values are sorted
console.log(canonicalizeTag("en-u-nu-latn-ca-gregory")); // 'en-u-ca-gregory-nu-latn'
```

## Preferred Value Substitution

Some subtags have preferred values that should be used instead:

```typescript
import { canonicalizeTag } from "ally-bcp-47";

// 'sgn-GR' should be 'gss'
console.log(canonicalizeTag("sgn-GR")); // 'gss'

// 'zh-cmn' should be 'zh'
console.log(canonicalizeTag("zh-cmn")); // 'zh'
```

## Canonicalization in the Validation Process

When you use `validateLanguageTag`, the result includes the canonicalized tag:

```typescript
import { validateLanguageTag } from "ally-bcp-47";

const result = validateLanguageTag("en-us");
console.log(result.tag.tag); // 'en-US'
```

## Programmatically Working with Canonical Forms

You might want to canonicalize tags before storing or comparing them:

```typescript
import { canonicalizeTag, isValid } from "ally-bcp-47";

function processUserLanguage(userInput) {
  if (!isValid(userInput)) {
    return { error: "Invalid language tag" };
  }

  const canonical = canonicalizeTag(userInput);

  // Store the canonical form in the database
  saveToDatabase(canonical);

  return { success: true, canonical };
}

// These are functionally equivalent after canonicalization
console.log(canonicalizeTag("zh-cmn-Hans-CN")); // 'zh-Hans-CN'
console.log(canonicalizeTag("zh-Hans-CN")); // 'zh-Hans-CN'
```

## Canonicalization for Comparison

Canonicalization helps with language tag comparison:

```typescript
import { canonicalizeTag } from "ally-bcp-47";

function areTagsEquivalent(tag1, tag2) {
  return canonicalizeTag(tag1) === canonicalizeTag(tag2);
}

console.log(areTagsEquivalent("en-us", "en-US")); // true
console.log(areTagsEquivalent("zh-cmn-Hans-CN", "zh-Hans-CN")); // true
console.log(areTagsEquivalent("en-Latn", "en")); // true
console.log(areTagsEquivalent("en-US", "en-GB")); // false
```

## Common Canonicalization Scenarios

### Consistent Database Storage

```typescript
import { canonicalizeTag, isValid } from "ally-bcp-47";

function prepareForStorage(tag) {
  if (!isValid(tag)) {
    throw new Error(`Invalid language tag: ${tag}`);
  }
  return canonicalizeTag(tag);
}
```

### User Input Normalization

```typescript
import { canonicalizeTag, isValid } from "ally-bcp-47";

function normalizeUserLanguageInput(input) {
  if (!isValid(input)) {
    return {
      isValid: false,
      message: "Please enter a valid language tag (e.g., en-US)",
    };
  }

  return {
    isValid: true,
    original: input,
    normalized: canonicalizeTag(input),
  };
}
```

### API Response Standardization

```typescript
import { canonicalizeTag } from "ally-bcp-47";

function standardizeApiResponse(data) {
  if (data.languageTag) {
    data.languageTag = canonicalizeTag(data.languageTag);
  }

  if (data.supportedLanguages) {
    data.supportedLanguages = data.supportedLanguages.map((tag) =>
      canonicalizeTag(tag)
    );
  }

  return data;
}
```

## Next Steps

- [ADA Compliance](./ada-compliance) - Learn how this library helps with ADA compliance
- [API Reference](/api/canonicalize-tag) - View the complete API documentation for canonicalization
