# Parsing

The `ally-bcp-47` library provides robust parsing capabilities to break down language tags into their component parts.

## Basic Parsing

The `parseTag` function takes a language tag and returns its components:

```typescript
import { parseTag } from "ally-bcp-47";

const tag = parseTag("en-US");
console.log(tag);
// {
//   language: 'en',
//   region: 'us'
// }

const complexTag = parseTag("zh-Hans-CN-u-ca-chinese-x-private");
console.log(complexTag);
// {
//   language: 'zh',
//   script: 'hans',
//   region: 'cn',
//   extensions: {
//     u: ['ca', 'chinese']
//   },
//   privateuse: ['private']
// }
```

## Parsing Results

The `parseTag` function returns an object with the following structure:

```typescript
type LanguageTag = {
  tag?: string; // The full tag (normalized)
  language?: string; // The language subtag
  extlang?: string[]; // Extended language subtags
  script?: string; // The script subtag
  region?: string; // The region subtag
  variants?: string[]; // Variant subtags
  extensions?: Record<string, string[]>; // Extension subtags
  privateuse?: string[]; // Private use subtags
  grandfathered?: boolean; // Whether this is a grandfathered tag
};
```

## Parsing with Validation

When using the `validateLanguageTag` function, you get both validation results and a parsed tag:

```typescript
import { validateLanguageTag } from "ally-bcp-47";

const result = validateLanguageTag("en-US");
console.log(result.isValid); // true
console.log(result.tag); // The parsed tag

// Handle invalid tags gracefully
const invalidResult = validateLanguageTag("en--US");
if (invalidResult.isValid) {
  // Work with the parsed tag
  console.log(invalidResult.tag);
} else {
  // Handle validation errors
  console.log(invalidResult.errors);
}
```

## Working with Parsed Tags

Once you have a parsed tag, you can work with its components:

```typescript
import { validateLanguageTag } from "ally-bcp-47";

function getLanguageInfo(tagString) {
  const result = validateLanguageTag(tagString);

  if (!result.isValid) {
    return { error: "Invalid language tag" };
  }

  const tag = result.tag;
  let info = {
    name: `${tag.language} language`,
  };

  if (tag.region) {
    info.regionInfo = `Used in region: ${tag.region}`;
  }

  if (tag.script) {
    info.scriptInfo = `Written in ${tag.script} script`;
  }

  return info;
}

console.log(getLanguageInfo("en-US"));
// { name: 'en language', regionInfo: 'Used in region: us' }

console.log(getLanguageInfo("zh-Hans-CN"));
// {
//   name: 'zh language',
//   regionInfo: 'Used in region: cn',
//   scriptInfo: 'Written in hans script'
// }
```

## Parsing Extensions

Extensions follow a specific structure and are parsed into an object:

```typescript
import { parseTag } from "ally-bcp-47";

// Unicode extension (u)
const localeTag = parseTag("en-US-u-ca-gregory-nu-latn");
console.log(localeTag.extensions.u);
// ['ca', 'gregory', 'nu', 'latn']

// Transformed content extension (t)
const transformedTag = parseTag("en-t-es-h0-hybrid");
console.log(transformedTag.extensions.t);
// ['es', 'h0', 'hybrid']
```

## Parsing Private Use Subtags

Private use subtags are parsed into an array:

```typescript
import { parseTag } from "ally-bcp-47";

const privateTag = parseTag("en-x-custom-subtag-123");
console.log(privateTag.privateuse);
// ['custom', 'subtag', '123']
```

## Error Handling

The `parseTag` function tries to parse as much as possible, even when parts of the tag are invalid:

```typescript
import { parseTag, isValid } from "ally-bcp-47";

// This tag has an invalid region subtag (ZZ)
const tag = parseTag("en-ZZ");
console.log(tag);
// { language: 'en', region: 'zz' }

// Check validity separately
console.log(isValid("en-ZZ")); // false
```

## Parsing and Canonicalization

When using `validateLanguageTag`, the parsed tag is automatically canonicalized:

```typescript
import { validateLanguageTag } from "ally-bcp-47";

const result = validateLanguageTag("en-us");
console.log(result.tag.tag); // 'en-US' (region code uppercased)
console.log(result.tag.region); // 'us' (original case preserved internally)
```

## Next Steps

- [Canonicalization](./canonicalization) - Learn how to normalize language tags
- [API Reference](/api/) - Explore the full API documentation
