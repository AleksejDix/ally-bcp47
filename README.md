# ally-bcp-47

A TypeScript package for working with BCP-47 language tags.

## Installation

```bash
npm install ally-bcp-47
```

## Usage

```typescript
import {
  isValidLanguageTag,
  parseLanguageTag,
  getLanguageDisplayName,
} from "ally-bcp-47";

// Validate a language tag
const isValid = isValidLanguageTag("en-US"); // true

// Parse a language tag into components
const parsedTag = parseLanguageTag("en-US");
// { language: 'en', region: 'US' }

// Get the display name of a language tag
const displayName = getLanguageDisplayName("fr-CA", "en"); // "Canadian French"
```

## API

### isValidLanguageTag(tag: string): boolean

Validates if a string is a valid BCP-47 language tag.

### parseLanguageTag(tag: string): object

Parses a BCP-47 language tag into its components.

### getLanguageDisplayName(tag: string, displayLocale?: string): string

Gets the display name of a language tag in a specific locale.

## License

MIT
