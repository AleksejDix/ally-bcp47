# Language Tags in Detail

BCP-47 language tags are structured identifiers that encode language, script, region, variant, and extension information. This page provides a detailed exploration of their structure and components.

## Tag Structure

A complete BCP-47 language tag has the following structure:

```
language-extlang-script-region-variant-extension-privateuse
```

<TagStructureVisual />

For example:

- `en-US` (English as used in the United States)
- `zh-Hans-CN` (Chinese, simplified script, as used in China)
- `sr-Latn-RS-valencia` (Serbian written in Latin script, as used in Serbia, Valencia variant)
- `en-US-u-ca-gregory` (English, United States, using the Gregorian calendar)

## Language Subtag (Required)

The language subtag is the only required component:

```
en    # English
fr    # French
de    # German
zh    # Chinese
ja    # Japanese
```

Language subtags are based on:

- ISO 639-1 (2-letter codes)
- ISO 639-2 (3-letter codes)
- ISO 639-3 (3-letter codes)
- ISO 639-5 (3-letter collection codes)

## Extended Language Subtags (Optional)

Extended language subtags identify more specific language variants. They are always 3 letters and are prefixed by the macrolanguage code:

```
zh-cmn  # Mandarin Chinese
zh-yue  # Cantonese Chinese
ar-afb  # Gulf Arabic
```

## Script Subtag (Optional)

The script subtag identifies the writing system:

```
zh-Hans   # Chinese written in Simplified script
zh-Hant   # Chinese written in Traditional script
sr-Latn   # Serbian written in Latin script
sr-Cyrl   # Serbian written in Cyrillic script
```

Script subtags are based on ISO 15924 and are always 4 letters, with the first letter capitalized.

## Region Subtag (Optional)

The region subtag identifies geographical region:

```
en-US   # English as used in the United States
en-GB   # English as used in the United Kingdom
es-ES   # Spanish as used in Spain
es-MX   # Spanish as used in Mexico
```

Region subtags are based on:

- ISO 3166-1 alpha-2 (2-letter country codes)
- UN M.49 (3-digit area codes)

## Variant Subtags (Optional)

Variant subtags identify dialectal, historical, or other variations:

```
de-DE-1901   # German, Germany, traditional orthography
sl-rozaj     # Resian dialect of Slovenian
ca-valencia  # Valencian variant of Catalan
```

Variant subtags can be:

- 5-8 alphanumeric characters
- Digit followed by 3 alphanumeric characters

## Extension Subtags (Optional)

Extension subtags allow additional information about language use. They consist of a singleton (single character) followed by subtags:

```
en-US-u-ca-gregory   # English, United States, using the Gregorian calendar
ar-EG-u-nu-arab      # Arabic, Egypt, using Arabic numerals
ja-JP-u-ca-japanese  # Japanese, Japan, using the Japanese calendar
```

Common extension singletons:

- `u`: Unicode locale extension (BCP 47)
- `t`: Transformed content
- `h`: Hyphenation information

## Private Use Subtags (Optional)

Private use subtags enable custom extensions for local use:

```
en-x-myextension     # English with private extension "myextension"
fr-FR-x-corp-french  # French with corporate dialect variant
```

Private use subtags are always prefixed by `x-`.

## Grandfathered and Irregular Tags

Some tags were defined before the BCP-47 standard and don't follow the regular structure:

```
i-navajo  # Navajo (now replaced by nv)
i-klingon # Klingon (now replaced by tlh)
```

Most grandfathered tags have regular equivalents that should be used instead.

## Canonical Form

BCP-47 defines a canonical form for language tags:

- Language codes are lowercase (`en`, not `EN`)
- Script codes have the first letter capitalized (`Latn`, not `latn` or `LATN`)
- Region codes are uppercase (`US`, not `us` or `Us`)
- Variant codes are typically lowercase

The library's `canonicalizeTag` function ensures tags follow these rules.

## Common Mistakes

### Using Country Codes as Language Codes

A common mistake is to use country codes as language codes:

- ❌ `ch-DE` (wrong: "ch" is Switzerland's country code, not a language)
- ❌ `ua-UA` (wrong: "ua" is the country code for Ukraine, "uk" is the language code)
- ✅ `de-CH` (correct: German as used in Switzerland)
- ✅ `uk-UA` (correct: Ukrainian as used in Ukraine)
- ✅ `gsw-CH` (correct: Swiss German as used in Switzerland)

### Using Incorrect Region Codes

Some regions have commonly misused codes:

- ❌ `en-UK` (wrong: "UK" is not the ISO code for the United Kingdom)
- ✅ `en-GB` (correct: English as used in Great Britain)

### Using Non-existent Scripts or Languages

- ❌ `en-Abcd` (wrong: "Abcd" is not a valid script code)
- ❌ `xx-US` (wrong: "xx" is not a valid language code)

## Best Practices

1. **Keep It Simple**: Only include necessary subtags
2. **Follow Standards**: Use standard codes from ISO registries
3. **Use Canonical Form**: Normalize case as described above
4. **Validate Input**: Always validate user-entered language tags

## Next Steps

Explore the [Validation](./validation) page to learn more about validating language tags with the `ally-bcp-47` library.
