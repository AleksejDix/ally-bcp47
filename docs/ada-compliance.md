# ADA Compliance Documentation

This document outlines how the BCP-47 language tag validation library supports compliance with the Americans with Disabilities Act (ADA) web accessibility requirements.

## Overview

The Americans with Disabilities Act (ADA) requires that digital content be accessible to people with disabilities. While the ADA doesn't explicitly mention language tags, proper language identification is a critical component of web accessibility, as it affects how screen readers and other assistive technologies interact with content.

## Language Tag Considerations for ADA Compliance

### Basic Requirements

1. **Proper Language Identification**:

   - Content language must be properly identified with valid BCP-47 language tags
   - Screen readers use language tags to determine pronunciation, voice, and reading rules

2. **Language Selection**:

   - Language selection should support multiple languages commonly used in the US
   - Regional variations should be properly represented

3. **Assistive Technology Support**:
   - Screen readers need proper language identification to select appropriate voice profiles
   - Speech recognition systems use language tags to apply the correct recognition models

## Supported Language Tags

### Official US Language Tags

- `en-US`: English (United States)
- `es-US`: Spanish (United States)
- `zh-Hans-US`: Chinese Simplified (United States)
- `zh-Hant-US`: Chinese Traditional (United States)

### Indigenous and Minority Languages

The library supports tags for indigenous and minority languages in the US:

- `nv-US`: Navajo
- `chr-US`: Cherokee
- `tl-US`: Tagalog
- `vi-US`: Vietnamese
- `ht-US`: Haitian Creole
- and many others...

## Accessibility Extensions

### Unicode Extensions for Accessibility

The library validates the following Unicode extensions that are important for accessibility:

1. **Time Formats**

   - `en-US-u-hc-h12`: 12-hour clock format (AM/PM)

2. **Number Formatting**

   - `en-US-u-nu-latn`: Latin numerals
   - `ar-US-u-nu-latn`: Arabic language with Latin numerals

3. **Calendar Systems**

   - `en-US-u-ca-gregory`: Gregorian calendar

4. **Week Preferences**

   - `en-US-u-fw-sun`: First day of week is Sunday

5. **Measurement Systems**
   - `en-US-u-ms-ussystem`: US measurement system

### Private Use Extensions for Assistive Technologies

The library supports private use extensions for screen readers and other assistive technologies:

1. **Screen Reader Tags**

   - `en-US-x-sr`: Screen reader mode
   - `en-US-x-hc`: High contrast mode
   - `en-US-x-sim`: Simplified content
   - `en-US-x-dys`: Dyslexic font preference

2. **Voice Recognition and Synthesis**
   - `en-US-x-speech`: Speech recognition
   - `en-US-x-voice-male`: Male voice synthesis
   - `en-US-x-voice-female`: Female voice synthesis

## Common Issues and Best Practices

### Issues to Avoid

1. **Invalid Language Codes**

   - Using full language names instead of ISO codes (e.g., "english" instead of "en")
   - Using 3-letter ISO 639-2 codes instead of 2-letter ISO 639-1 codes when available
   - Using country name abbreviations instead of ISO codes (e.g., "USA" instead of "US")

2. **Syntax Errors**
   - Incomplete tags (e.g., "en-")
   - Incorrect format for extensions (e.g., "en-GB-u")

### Best Practices

1. **Canonical Form**

   - Use canonical form with proper case: language subtags lowercase, region subtags uppercase, script subtags titlecase
   - Example: `en-US`, `zh-Hans-US`

2. **Content Matching**

   - Ensure the language tag matches the actual content language
   - Use the most specific tag that accurately represents the content

3. **Assistive Technology Considerations**
   - Include appropriate extensions when needed for screen readers and other assistive technology
   - Test with popular screen readers to ensure proper language detection

## Examples

### Basic Tags

```javascript
validateLanguageTag("en-US"); // English (United States)
validateLanguageTag("es-US"); // Spanish (United States)
```

### Tags with Extensions

```javascript
validateLanguageTag("en-US-u-hc-h12"); // US English with 12-hour clock
validateLanguageTag("en-US-x-sr"); // US English for screen readers
```

## Testing

The library includes comprehensive tests for ADA compliance:

```bash
# Run all ADA compliance tests
npm run test:ada

# Run demo with examples
npm run demo:ada
```

## Resources

- [W3C Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/TR/WCAG21/)
- [Section 508 Standards](https://www.section508.gov/)
- [WebAIM: Language Codes](https://webaim.org/techniques/language/)
