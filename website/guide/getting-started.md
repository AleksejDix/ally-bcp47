# Getting Started

## Installation

First, install the `ally-bcp-47` package using npm, yarn, or pnpm:

```bash
# npm
npm install ally-bcp-47

# yarn
yarn add ally-bcp-47

# pnpm
pnpm add ally-bcp-47
```

## Basic Usage

Here's a simple example of how to use the library:

```typescript
import { validateLanguageTag, isValid } from "ally-bcp-47";

// Quick validation
const isValidTag = isValid("en-US"); // true

// Detailed validation
const result = validateLanguageTag("en-US");
console.log(result.isValid); // true
console.log(result.isWellFormed); // true
console.log(result.tag); // { tag: 'en-US', language: 'en', region: 'us' }

// Invalid tag example
const invalidResult = validateLanguageTag("en-ZZ");
console.log(invalidResult.isValid); // false
console.log(invalidResult.errors);
// [{
//   type: 'unknown_subtag',
//   message: 'Unknown region subtag: ZZ',
//   subtag: 'ZZ',
//   subtagType: 'region'
// }]
```

## When to Use This Library

The `ally-bcp-47` library is particularly useful in the following scenarios:

1. **Internationalization (i18n)**: When building multilingual applications
2. **Web Accessibility**: Ensuring proper language identification for screen readers
3. **Content Management Systems**: Validating user-entered language preferences
4. **Data Validation**: Ensuring language codes in your database are valid
5. **Compliance Requirements**: Meeting ADA, Section 508, or EAA requirements

## Features Overview

The library provides several key functions:

- **validateLanguageTag()**: Comprehensive validation with detailed results
- **isValid()**: Quick check if a tag is valid
- **isWellFormed()**: Check if a tag follows the correct syntax
- **parseTag()**: Parse a tag into its component parts
- **canonicalizeTag()**: Normalize a tag to its canonical form

## Next Steps

Explore the following sections to learn more:

- [Language Tags](./language-tags) - More about BCP-47 tag structure
- [Validation](./validation) - Detailed validation options
- [Canonicalization](./canonicalization) - How to normalize tags
- [Accessibility Compliance](./ada-compliance) - Meeting accessibility standards
