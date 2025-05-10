# Existing BCP-47 Validation Libraries in JavaScript/TypeScript

This document reviews currently available JavaScript and TypeScript libraries for BCP-47 language tag validation, analyzing their capabilities and limitations.

## Summary of Available Libraries

| Library        | Basic Parsing | IANA Registry | Canonicalization | Error Reporting | Last Updated | Stars |
| -------------- | :-----------: | :-----------: | :--------------: | :-------------: | :----------: | :---: |
| bcp-47         |      ✅       |      ❌       |        ❌        |     Limited     |     2018     | ~30k  |
| language-tags  |      ✅       |    Partial    |        ❌        |      Basic      |     2017     | ~120k |
| langtag-utils  |      ✅       |      ❌       |        ❌        |     Limited     |     2019     |  ~3k  |
| intl-locale    |      ✅       |      ❌       |     Limited      |     Limited     |    Active    |  N/A  |
| i18next        |    Limited    |      ❌       |        ❌        |       ❌        |    Active    | ~240k |
| bcp47-validate |      ✅       |    Limited    |        ❌        |      Basic      |     2021     |  ~5k  |

## Detailed Reviews

### 1. bcp-47 (npm)

**Repository**: https://github.com/wooorm/bcp-47

**Features**:

- Basic syntax validation according to BCP-47 grammar
- Parsing language tags into component subtags
- TypeScript types
- Small footprint (~1KB)

**Limitations**:

- No validation against IANA Language Subtag Registry
- No handling of deprecated subtags
- No canonicalization support
- Limited error reporting
- Doesn't validate extension subtags properly
- No support for grandfathered tags

**Usage Example**:

```js
import { parse } from "bcp-47";

parse("en-US");
// => { language: 'en', region: 'US' }

parse("en--US");
// => { language: 'en', region: 'US' } (accepts invalid format)

parse("xx-YY");
// => { language: 'xx', region: 'YY' } (accepts non-existent subtags)
```

**Verdict**: Useful for basic parsing but insufficient for comprehensive validation.

### 2. language-tags (npm)

**Repository**: https://github.com/mattcg/language-tags

**Features**:

- More comprehensive parsing and validation
- Includes data from the IANA registry
- Checks some subtags against registry
- Provides more detailed tag information
- TypeScript compatible

**Limitations**:

- Outdated IANA registry data
- Incomplete registry validation
- No proper canonicalization
- Limited error reporting
- Not actively maintained
- Larger bundle size

**Usage Example**:

```js
import * as tags from "language-tags";

tags.check("en-US"); // => true
tags.check("xx-YY"); // => false (does check registry)

const tag = tags.tag("en-US");
tag.language(); // => BCP47.Subtag object
```

**Verdict**: Better validation than most alternatives, but outdated and not maintained.

### 3. langtag-utils (npm)

**Repository**: https://github.com/smhg/langtag-utils

**Features**:

- Simple parsing utilities
- Lightweight
- Provides basic functions for working with language tags

**Limitations**:

- Very limited validation
- No registry integration
- No canonicalization
- Limited documentation
- Small user base

**Usage Example**:

```js
import { parse, isValid } from "langtag-utils";

parse("en-US"); // => { language: 'en', region: 'US' }
isValid("en-US"); // => true (but only checks format)
```

**Verdict**: Too basic for serious validation needs.

### 4. intl-locale (part of format.js)

**Repository**: https://github.com/formatjs/formatjs/tree/main/packages/intl-locale

**Features**:

- Integration with JavaScript's Intl API
- Basic language tag parsing
- Active maintenance
- Well-documented
- Part of a larger internationalization ecosystem

**Limitations**:

- Not a dedicated validation library
- Limited validation capabilities
- Focused on Intl functionality rather than strict BCP-47 compliance
- No registry validation

**Usage Example**:

```js
import { Locale } from "@formatjs/intl-locale";

const locale = new Locale("en-US");
locale.baseName; // => 'en-US'
```

**Verdict**: Good for Intl API integration but not for comprehensive validation.

### 5. i18next

**Repository**: https://github.com/i18next/i18next

**Features**:

- Complete internationalization framework
- Language detection
- Resource management
- Active development and large community

**Limitations**:

- Not focused on validation
- Only basic language tag handling
- No registry validation
- No dedicated validation functions

**Usage Example**:

```js
import i18next from "i18next";

i18next.init({
  lng: "en-US",
});
```

**Verdict**: Excellent i18n framework but not suitable as a validation library.

### 6. bcp47-validate

**Repository**: https://github.com/kapanlagi-youniverse/bcp47-validate

**Features**:

- Focused on validation
- Basic registry checks
- Simple API

**Limitations**:

- Limited registry data
- No canonicalization
- Basic error reporting
- Small user base
- Not actively maintained

**Usage Example**:

```js
import validate from "bcp47-validate";

validate("en-US"); // => true
validate("xx-YY"); // => false
```

**Verdict**: Better than nothing, but still limited.

## Conclusion

While several libraries offer basic language tag parsing and some validation capabilities, there is no comprehensive JavaScript/TypeScript library that:

1. **Fully implements** the BCP-47 specification (RFC 5646)
2. **Maintains current** IANA Registry data
3. **Provides robust** canonicalization
4. **Offers detailed** error reporting and suggestions
5. **Handles all** special cases (grandfathered tags, extended language subtags, etc.)

This gap in the ecosystem necessitates the development of a new, more complete validation library to address the requirements outlined in our research document.
