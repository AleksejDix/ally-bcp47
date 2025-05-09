# Basic Validation Examples

Below are examples of how to use the ally-bcp-47 library for validating language tags.

## Simple Validation

The most basic way to validate a language tag is to use the `isValid` function:

```typescript
import { isValid } from "ally-bcp-47";

// Valid language tags
console.log(isValid("en")); // true
console.log(isValid("en-US")); // true
console.log(isValid("zh-Hans-CN")); // true

// Invalid language tags
console.log(isValid("en-ZZ")); // false - ZZ is not a valid region code
console.log(isValid("foo")); // false - 'foo' is not a valid language subtag
console.log(isValid("en--US")); // false - double hyphens are not allowed
```

## Detailed Validation

For more detailed validation results, use the `validateLanguageTag` function:

```typescript
import { validateLanguageTag } from "ally-bcp-47";

const result = validateLanguageTag("en-US");

if (result.isValid) {
  console.log("The tag is valid!");
  console.log("Parsed tag:", result.tag);
} else {
  console.log("The tag is invalid:");
  for (const error of result.errors || []) {
    console.log(`- ${error.message}`);
  }
}
```

## Validation with Options

You can customize the validation behavior with options:

```typescript
import { validateLanguageTag } from "ally-bcp-47";

// Skip registry validation (only check syntax)
const syntaxResult = validateLanguageTag("en-ZZ", {
  checkRegistry: false,
});

console.log(syntaxResult.isWellFormed); // true
console.log(syntaxResult.isValid); // true (since we're not checking the registry)

// With registry validation (the default)
const registryResult = validateLanguageTag("en-ZZ", {
  checkRegistry: true,
});

console.log(registryResult.isWellFormed); // true
console.log(registryResult.isValid); // false (ZZ is not a valid region)
```

## Interactive Example

Try the validator below with your own language tags:

<div class="custom-block">
  <LanguageTagValidator />
</div>

## Real-world Examples

Here are some real-world examples of using the library:

### HTML lang Attribute Validation

```typescript
import { isValid, canonicalizeTag } from "ally-bcp-47";

function validateHtmlLang(element: HTMLElement) {
  const lang = element.getAttribute("lang");

  if (!lang) {
    console.warn("Missing lang attribute");
    return false;
  }

  if (!isValid(lang)) {
    console.warn(`Invalid lang attribute: ${lang}`);
    return false;
  }

  // Ensure the lang attribute is in canonical form
  const canonical = canonicalizeTag(lang);
  if (canonical !== lang) {
    console.info(`Updating lang attribute from ${lang} to ${canonical}`);
    element.setAttribute("lang", canonical);
  }

  return true;
}
```

### Content Negotiation

```typescript
import { isValid, canonicalizeTag } from "ally-bcp-47";

function negotiateLanguage(
  acceptLanguageHeader: string,
  availableLanguages: string[]
) {
  // Parse Accept-Language header
  const userPreferences = acceptLanguageHeader
    .split(",")
    .map((part) => {
      const [lang, qPart] = part.trim().split(";");
      const q = qPart ? parseFloat(qPart.split("=")[1]) : 1.0;
      return { lang, q };
    })
    .filter((pref) => isValid(pref.lang))
    .sort((a, b) => b.q - a.q);

  // Canonicalize available languages
  const canonicalAvailable = availableLanguages
    .filter((lang) => isValid(lang))
    .map((lang) => canonicalizeTag(lang));

  // Find the best match
  for (const pref of userPreferences) {
    const canonical = canonicalizeTag(pref.lang);

    // Exact match
    if (canonicalAvailable.includes(canonical)) {
      return canonical;
    }

    // Partial match (e.g., 'en-US' matches 'en')
    const base = canonical.split("-")[0];
    const baseMatch = canonicalAvailable.find(
      (lang) => lang === base || lang.startsWith(base + "-")
    );

    if (baseMatch) {
      return baseMatch;
    }
  }

  // Default to first available
  return canonicalAvailable[0];
}
```

In the next examples, we'll explore how to handle errors and work with parsed tags.
