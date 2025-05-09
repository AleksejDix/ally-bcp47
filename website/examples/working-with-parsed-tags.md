# Working with Parsed Tags

This page demonstrates how to work with the structured data returned by the `parseTag` function in the `ally-bcp-47` library.

## Basic Parsing

The first step is to parse a language tag into its components:

```typescript
import { parseTag } from "ally-bcp-47";

// Parse a simple language tag
const tag = parseTag("en-US");

console.log(tag);
// Output:
// {
//   tag: 'en-US',
//   language: 'en',
//   region: 'US'
// }
```

## Accessing Tag Components

Once you have a parsed tag, you can access its components directly:

```typescript
import { parseTag } from "ally-bcp-47";

const tag = parseTag("zh-Hans-CN");

// Access individual components
console.log(`Language: ${tag.language}`); // Language: zh
console.log(`Script: ${tag.script}`); // Script: Hans
console.log(`Region: ${tag.region}`); // Region: CN

// Handle optional components safely
const simpleTag = parseTag("fr");
console.log(`Language: ${simpleTag.language}`); // Language: fr
console.log(`Script: ${simpleTag.script || "None"}`); // Script: None
console.log(`Region: ${simpleTag.region || "None"}`); // Region: None
```

## Working with Variants

Variant subtags are returned as an array:

```typescript
import { parseTag } from "ally-bcp-47";

const tag = parseTag("de-DE-1901-1996");

if (tag.variants && tag.variants.length > 0) {
  console.log("Variants:");
  tag.variants.forEach((variant) => {
    console.log(`- ${variant}`);
  });
}
// Output:
// Variants:
// - 1901
// - 1996
```

## Working with Extensions

Extension subtags are organized by singleton in an object:

```typescript
import { parseTag } from "ally-bcp-47";

const tag = parseTag("en-US-u-ca-gregory-nu-latn-t-m0-iso-i-klingon");

// Unicode extensions (u)
if (tag.extensions && tag.extensions.u) {
  console.log("Unicode extensions:");
  for (let i = 0; i < tag.extensions.u.length; i += 2) {
    const key = tag.extensions.u[i];
    const value = tag.extensions.u[i + 1] || "";
    console.log(`- ${key}: ${value}`);
  }
}
// Output:
// Unicode extensions:
// - ca: gregory
// - nu: latn

// Transformed content extensions (t)
if (tag.extensions && tag.extensions.t) {
  console.log("Transformed content extensions:");
  console.log(tag.extensions.t);
}
// Output:
// Transformed content extensions:
// ['m0', 'iso']

// Other extensions
if (tag.extensions && tag.extensions.i) {
  console.log("Other extensions (i):");
  console.log(tag.extensions.i);
}
// Output:
// Other extensions (i):
// ['klingon']
```

## Working with Private Use Subtags

Private use subtags are returned as an array:

```typescript
import { parseTag } from "ally-bcp-47";

const tag = parseTag("en-x-private1-private2");

if (tag.privateuse && tag.privateuse.length > 0) {
  console.log("Private use subtags:");
  console.log(tag.privateuse);
}
// Output:
// Private use subtags:
// ['private1', 'private2']
```

## Modifying and Reconstructing Tags

You can create modified versions of language tags by parsing, modifying components, and then reconstructing:

```typescript
import { parseTag, validateLanguageTag } from "ally-bcp-47";

function changeRegion(tag, newRegion) {
  const parsed = parseTag(tag);
  if (!parsed) return null;

  // Create a modified version
  const parts = [];
  parts.push(parsed.language);
  if (parsed.extlang) parts.push(parsed.extlang);
  if (parsed.script) parts.push(parsed.script);
  parts.push(newRegion);
  if (parsed.variants) parts.push(...parsed.variants);

  // Handle extensions and privateuse if needed
  // ...

  const newTag = parts.join("-");

  // Validate the new tag before returning
  const result = validateLanguageTag(newTag);
  return result.isValid ? newTag : null;
}

// Example usage
const americanEnglish = "en-US";
const britishEnglish = changeRegion(americanEnglish, "GB");
console.log(britishEnglish); // en-GB

// More complex example
const americanChinese = "zh-Hans-US";
const chineseChinese = changeRegion(americanChinese, "CN");
console.log(chineseChinese); // zh-Hans-CN
```

## Filtering and Grouping Language Tags

Parsed tags are useful for filtering and grouping:

```typescript
import { parseTag } from "ally-bcp-47";

// A collection of language tags
const languageTags = [
  "en-US",
  "en-GB",
  "en-AU",
  "fr-FR",
  "fr-CA",
  "fr-BE",
  "es-ES",
  "es-MX",
  "es-AR",
];

// Group tags by language
const groupedByLanguage = {};

languageTags.forEach((tagString) => {
  const tag = parseTag(tagString);
  if (tag) {
    if (!groupedByLanguage[tag.language]) {
      groupedByLanguage[tag.language] = [];
    }
    groupedByLanguage[tag.language].push(tagString);
  }
});

console.log(groupedByLanguage);
// Output:
// {
//   'en': ['en-US', 'en-GB', 'en-AU'],
//   'fr': ['fr-FR', 'fr-CA', 'fr-BE'],
//   'es': ['es-ES', 'es-MX', 'es-AR']
// }

// Filter for a specific region
const northAmericanTags = languageTags.filter((tagString) => {
  const tag = parseTag(tagString);
  return (
    tag && (tag.region === "US" || tag.region === "CA" || tag.region === "MX")
  );
});

console.log(northAmericanTags);
// Output: ['en-US', 'fr-CA', 'es-MX']
```

## Language Matching

Parsed tags are essential for implementing language matching algorithms:

```typescript
import { parseTag } from "ally-bcp-47";

// Function to calculate how closely two language tags match
function calculateTagMatch(userTag, availableTag) {
  const userParsed = parseTag(userTag);
  const availableParsed = parseTag(availableTag);

  if (!userParsed || !availableParsed) return 0;

  let score = 0;

  // Match language (most important)
  if (userParsed.language === availableParsed.language) {
    score += 100;

    // Match region if present
    if (
      userParsed.region &&
      availableParsed.region &&
      userParsed.region === availableParsed.region
    ) {
      score += 50;
    }

    // Match script if present
    if (
      userParsed.script &&
      availableParsed.script &&
      userParsed.script === availableParsed.script
    ) {
      score += 30;
    }

    // Match variants if present
    if (userParsed.variants && availableParsed.variants) {
      // Count matching variants
      const userVariantSet = new Set(userParsed.variants);
      const matchingVariants = availableParsed.variants.filter((v) =>
        userVariantSet.has(v)
      );
      score += matchingVariants.length * 10;
    }
  }

  return score;
}

// Example usage
const userPreference = "zh-Hans-CN";
const availableTags = ["zh-CN", "zh-Hans-CN", "zh-Hant-TW", "zh", "en-US"];

// Sort available tags by match score
const rankedTags = availableTags
  .map((tag) => ({
    tag,
    score: calculateTagMatch(userPreference, tag),
  }))
  .sort((a, b) => b.score - a.score);

console.log("Ranked matches for", userPreference);
rankedTags.forEach(({ tag, score }) => {
  console.log(`${tag}: ${score}`);
});
// Output:
// Ranked matches for zh-Hans-CN
// zh-Hans-CN: 180
// zh-CN: 150
// zh: 100
// zh-Hant-TW: 100
// en-US: 0
```

## Fallback Chains

Create fallback chains from parsed tags:

```typescript
import { parseTag, validateLanguageTag } from "ally-bcp-47";

// Generate a chain of fallback language tags
function getFallbackChain(originalTag) {
  const result = [];
  const parsed = parseTag(originalTag);
  if (!parsed) return result;

  // Add the original tag
  result.push(originalTag);

  let current = { ...parsed };

  // Remove privateuse
  if (current.privateuse) {
    const copy = { ...current };
    delete copy.privateuse;

    // Reconstruct the tag
    const parts = [copy.language];
    if (copy.extlang) parts.push(copy.extlang);
    if (copy.script) parts.push(copy.script);
    if (copy.region) parts.push(copy.region);
    if (copy.variants) parts.push(...copy.variants);

    // Handle extensions if needed
    // ...

    const newTag = parts.join("-");
    if (validateLanguageTag(newTag).isValid && newTag !== originalTag) {
      result.push(newTag);
    }
  }

  // Remove variants
  if (current.variants && current.variants.length) {
    const copy = { ...current };
    delete copy.variants;

    // Reconstruct
    const parts = [copy.language];
    if (copy.extlang) parts.push(copy.extlang);
    if (copy.script) parts.push(copy.script);
    if (copy.region) parts.push(copy.region);

    const newTag = parts.join("-");
    if (validateLanguageTag(newTag).isValid && !result.includes(newTag)) {
      result.push(newTag);
    }
  }

  // Remove region
  if (current.region) {
    const copy = { ...current };
    delete copy.region;

    // Reconstruct
    const parts = [copy.language];
    if (copy.extlang) parts.push(copy.extlang);
    if (copy.script) parts.push(copy.script);

    const newTag = parts.join("-");
    if (validateLanguageTag(newTag).isValid && !result.includes(newTag)) {
      result.push(newTag);
    }
  }

  // Remove script
  if (current.script) {
    const copy = { ...current };
    delete copy.script;

    // Reconstruct
    const parts = [copy.language];
    if (copy.extlang) parts.push(copy.extlang);

    const newTag = parts.join("-");
    if (validateLanguageTag(newTag).isValid && !result.includes(newTag)) {
      result.push(newTag);
    }
  }

  // Remove extlang
  if (current.extlang) {
    const copy = { ...current };
    delete copy.extlang;

    // Reconstruct
    const newTag = copy.language;
    if (validateLanguageTag(newTag).isValid && !result.includes(newTag)) {
      result.push(newTag);
    }
  }

  return result;
}

// Example usage
const tag = "zh-Hans-CN-variant-x-private";
const fallbacks = getFallbackChain(tag);

console.log("Fallback chain:");
fallbacks.forEach((tag) => console.log(`- ${tag}`));
// Output:
// Fallback chain:
// - zh-Hans-CN-variant-x-private
// - zh-Hans-CN-variant
// - zh-Hans-CN
// - zh-Hans
// - zh
```

## Conclusion

Parsed language tags provide a structured way to access, manipulate, and reason about BCP-47 language tags. By using the `parseTag` function, you can:

1. Access individual components of a language tag
2. Work with complex tags containing variants, extensions, and private use subtags
3. Create modified versions of existing tags
4. Implement language matching and fallback logic
5. Filter and group collections of language tags

For more information, see the [`parseTag` API documentation](/api/parse-tag).
