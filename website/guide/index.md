# What is BCP-47?

BCP-47 is a standardized format for language tags, which are used to identify human languages in computing contexts. The standard is defined in [RFC 5646](https://datatracker.ietf.org/doc/html/rfc5646) and combines several ISO standards to create a comprehensive system for language identification.

## Why Language Tags Matter

Language tags are critical for:

- **Web Accessibility**: Screen readers and other assistive technologies rely on proper language tags to pronounce content correctly.
- **Internationalization (i18n)**: Applications need to know which language to display to users.
- **Search Engine Optimization (SEO)**: Search engines use language tags to index and serve content in the appropriate language.
- **Content Negotiation**: Servers can deliver appropriate content based on language preferences.

## BCP-47 Structure

A BCP-47 language tag consists of subtags separated by hyphens. Each subtag provides specific information about the language:

```
language-extlang-script-region-variant-extension-privateuse
```

### Primary Language Subtag

The primary language subtag is based on ISO 639 standards and identifies the base language:

```
en     # English
fr     # French
zh     # Chinese
```

### Script Subtag

The script subtag (based on ISO 15924) identifies the writing system:

```
zh-Hans  # Chinese written in Simplified script
zh-Hant  # Chinese written in Traditional script
sr-Latn  # Serbian written in Latin script
sr-Cyrl  # Serbian written in Cyrillic script
```

### Region Subtag

The region subtag (based on ISO 3166-1 or UN M.49) identifies the region:

```
en-US   # English as used in the United States
en-GB   # English as used in the United Kingdom
fr-CA   # French as used in Canada
fr-FR   # French as used in France
```

### Variant Subtags

Variant subtags identify variations of a language:

```
de-DE-1901   # German, as used in Germany, traditional orthography
sl-rozaj     # Resian dialect of Slovenian
```

### Extension Subtags

Extension subtags allow for extensions to the language tag:

```
en-US-u-ca-gregory   # English, United States, using the Gregorian calendar
ja-JP-u-ca-japanese  # Japanese, Japan, using the Japanese calendar
```

### Private Use Subtags

Private use subtags allow for private agreements between parties:

```
en-x-custom    # English with a private use subtag "custom"
fr-FR-x-corp   # French as used in France with a corporate dialect
```

## Why Use ally-bcp-47?

The `ally-bcp-47` library provides comprehensive validation, parsing, and canonicalization of BCP-47 language tags, ensuring that your application correctly handles language identification. This is particularly important for:

- **Accessibility Compliance**: Including ADA, Section 508, and European Accessibility Act requirements
- **Internationalization**: Building applications that work correctly across language boundaries
- **Data Consistency**: Ensuring that language tags are stored and processed in a consistent format

In the next sections, we'll explore how to use the library to validate and work with BCP-47 language tags.
