# ally-bcp-47

A comprehensive TypeScript library for validating, parsing, and working with BCP-47 language tags according to [RFC 5646](https://tools.ietf.org/html/rfc5646).

## Features

- **Complete BCP-47 syntax validation** - Validates against the full ABNF grammar
- **Detailed parsing** - Breaks down language tags into their component subtags
- **Helpful error messages** - Clear, actionable error reporting
- **No dependencies** - Lightweight and focused
- **TypeScript-first** - Full type definitions included

## Installation

```bash
npm install ally-bcp-47
```

## Usage

### Basic Validation

```typescript
import { isValid, isWellFormed } from "ally-bcp-47";

// Check if a tag is well-formed (syntax only)
isWellFormed("en-US"); // true
isWellFormed("en--US"); // false

// Check if a tag is valid (syntax + registry validation)
isValid("en-US"); // true
isValid("xy-ZZ"); // false (invalid subtags)
```

### Detailed Validation

```typescript
import { validateLanguageTag } from "ally-bcp-47";

const result = validateLanguageTag("en-US");
console.log(result);
/* Output:
{
  isWellFormed: true,
  isValid: true,
  tag: {
    tag: "en-us",
    language: "en",
    region: "us"
  }
}
*/

const invalidResult = validateLanguageTag("en-a");
console.log(invalidResult);
/* Output:
{
  isWellFormed: false,
  isValid: false,
  errors: [{
    type: "invalid_extension",
    message: "Extension singleton a must be followed by at least one extension subtag",
    subtag: "a",
    subtagType: "extension",
    position: 3
  }]
}
*/
```

### Parsing Tags

```typescript
import { parseTag } from "ally-bcp-47";

const tag = parseTag("zh-Hans-CN-x-private");
console.log(tag);
/* Output:
{
  tag: "zh-hans-cn-x-private",
  language: "zh",
  script: "hans",
  region: "cn",
  privateuse: ["private"]
}
*/
```

## Validation Options

The `validateLanguageTag` function accepts options to customize the validation:

```typescript
import { validateLanguageTag } from "ally-bcp-47";

validateLanguageTag("en-US", {
  checkRegistry: true, // Whether to validate against the registry (default: true)
  warnOnDeprecated: true, // Whether to return warnings for deprecated subtags (default: true)
  warnOnRedundantScript: true, // Whether to warn about redundant scripts (default: true)
});
```

## Tag Components

The library breaks down language tags into their component parts:

- `language` - Primary language subtag (e.g., 'en', 'fr')
- `extlang` - Extended language subtags (e.g., 'cmn')
- `script` - Script subtag (e.g., 'Latn', 'Cyrl')
- `region` - Region subtag (e.g., 'US', '001')
- `variants` - Variant subtags (e.g., '1996')
- `extensions` - Extension subtags (e.g., 'u-ca-gregory')
- `privateuse` - Private use subtags (e.g., 'x-private')

## Roadmap

- [ ] Registry validation
- [ ] Canonicalization
- [ ] Registry update mechanism
- [ ] More extensive validation options
- [ ] Tag generation from components

## European Accessibility Act Compliance

This library includes comprehensive testing for all European language tags to support compliance with the European Accessibility Act (Directive (EU) 2019/882).

### Features for EAA Compliance

- Validation of all 24 official EU language tags
- Support for regional and minority language tags
- Validation of accessibility-related extensions (number formatting, calendar systems, etc.)
- Specific handling of common errors like country codes used as language codes (e.g., ch-DE)

### Running European-specific Tests

```bash
# Test all European language tags
npm run test:european

# Test accessibility extensions
npm run test:accessibility

# Run the ch-DE specific test cases
npm run test:ch-de

# Demo of European language tag validation
npm run demo:european
```

For more details, see the [European Accessibility Act Compliance Documentation](./docs/eaa-compliance.md).

## Americans with Disabilities Act (ADA) Compliance

This library includes comprehensive testing for US language tags to support compliance with the Americans with Disabilities Act (ADA) requirements for web accessibility.

### Features for ADA Compliance

- Validation of US English and other common US language tags
- Support for languages commonly spoken in the US
- Validation of accessibility-related extensions (time formats, number systems, measurement units)
- Private use extensions for screen readers and assistive technologies
- Case normalization according to BCP-47 standards

### Running ADA-specific Tests

```bash
# Test all ADA-related language tags
npm run test:ada

# Demo of ADA-related language tag validation
npm run demo:ada
```

For more details, see the [Americans with Disabilities Act Compliance Documentation](./docs/ada-compliance.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
