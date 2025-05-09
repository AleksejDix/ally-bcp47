# European Accessibility Act Compliance

This document describes how our BCP-47 language tag validation library supports compliance with the [European Accessibility Act (EAA)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0882) requirements.

## Background

The European Accessibility Act (Directive (EU) 2019/882) aims to improve the functioning of the internal market for accessible products and services by removing barriers created by divergent rules in Member States. The directive includes requirements for websites, mobile applications, and other digital services to be accessible to persons with disabilities.

Proper language tagging is an essential part of digital accessibility, as it ensures:

1. Correct pronunciation in screen readers
2. Appropriate text-to-speech processing
3. Proper text rendering and font selection
4. Correct application of language-specific rules for layout and formatting

## Testing Coverage

Our library includes comprehensive testing specifically focused on European language tags:

### Official EU Languages

We test all 24 official EU languages with their respective country codes:

- Bulgarian (bg-BG)
- Croatian (hr-HR)
- Czech (cs-CZ)
- Danish (da-DK)
- Dutch (nl-NL)
- English (en-GB)
- Estonian (et-EE)
- Finnish (fi-FI)
- French (fr-FR)
- German (de-DE)
- Greek (el-GR)
- Hungarian (hu-HU)
- Irish (ga-IE)
- Italian (it-IT)
- Latvian (lv-LV)
- Lithuanian (lt-LT)
- Maltese (mt-MT)
- Polish (pl-PL)
- Portuguese (pt-PT)
- Romanian (ro-RO)
- Slovak (sk-SK)
- Slovenian (sl-SI)
- Spanish (es-ES)
- Swedish (sv-SE)

### Regional and Minority Languages

We also test regional and minority languages protected under the European Charter for Regional or Minority Languages:

- Basque (eu-ES)
- Catalan (ca-ES)
- Galician (gl-ES)
- Welsh (cy-GB)
- Scottish Gaelic (gd-GB)
- and many others

### Accessibility Extensions

The library validates BCP-47 language tags with extensions that are important for accessibility:

- Time formats (12h/24h): e.g., `de-DE-u-hc-h23`
- Number formatting: e.g., `fr-FR-u-nu-latn`
- Calendar systems: e.g., `el-GR-u-ca-gregory`
- First day of week: e.g., `es-ES-u-fw-mon`
- Collation (sorting): e.g., `de-DE-u-co-phonebk`

## Common Issues and Corrections

Our tests specifically identify common mistakes in language tagging that can impact accessibility:

### Country Code as Language Code

A common error is using country codes as language codes. For example:

- `ch-DE` (incorrect) - `ch` is the country code for Switzerland
- Correct alternatives:
  - `de-CH` for German in Switzerland
  - `gsw-CH` for Swiss German in Switzerland
  - `zh-DE` for Chinese in Germany

### Incomplete Tags

We validate against incomplete tags that can cause accessibility issues:

- `en-` (missing region code)
- `en-GB-u` (incomplete extension)

### Case Sensitivity

While BCP-47 language tags are case-insensitive, our library normalizes tags to ensure consistent processing:

- `EN-gb` → `en-GB` (normalized for presentation)

## Running the Tests

You can run the European-specific tests with:

```bash
npm run test:european
```

To specifically test accessibility extensions:

```bash
npm run test:accessibility
```

## Recommendations for EAA Compliance

1. Always use valid BCP-47 language tags in the `lang` attribute of HTML elements
2. Ensure the primary language of the page is correctly specified in the `<html>` element
3. Use proper language tags for sections in different languages
4. Consider using extension subtags for content that requires specific formatting (numbers, dates, etc.)
5. Validate language tags with our library to ensure compliance with BCP-47 standards

## Future Enhancements

Our roadmap includes additional features to enhance EAA compliance:

1. Complete registry validation against ISO 639/ISO 3166 codes
2. Suggestions for corrections when invalid tags are detected
3. Special handling for deprecated language codes
4. Integration with accessibility testing tools
