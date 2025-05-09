# getLanguageDisplayName

A utility function that converts a BCP-47 language tag to a human-readable language name.

## Signature

```typescript
function getLanguageDisplayName(
  tag: string,
  displayLocale: string = "en"
): string;
```

## Description

`getLanguageDisplayName` takes a BCP-47 language tag and returns its human-readable name in the specified locale. This function uses the browser's `Intl.DisplayNames` API to format the language name.

## Parameters

| Parameter       | Type     | Required | Default | Description                                |
| --------------- | -------- | -------- | ------- | ------------------------------------------ |
| `tag`           | `string` | Yes      | -       | The BCP-47 language tag                    |
| `displayLocale` | `string` | No       | `"en"`  | The locale to display the language name in |

## Returns

- A string containing the language name in the specified locale
- If the language tag is not recognized, the original tag is returned

## Examples

```typescript
import { getLanguageDisplayName } from "@aleksejdix/ally-bcp47";

// Display language names in English (default)
getLanguageDisplayName("en"); // "English"
getLanguageDisplayName("fr"); // "French"
getLanguageDisplayName("de-DE"); // "German (Germany)"
getLanguageDisplayName("zh-Hans-CN"); // "Chinese (Simplified, China)"

// Display language names in other locales
getLanguageDisplayName("en", "fr"); // "anglais"
getLanguageDisplayName("fr", "de"); // "Französisch"
getLanguageDisplayName("ja", "ja"); // "日本語"
```

## Browser Support

This function uses the `Intl.DisplayNames` API, which is supported in:

- Chrome 81+
- Edge 81+
- Firefox 86+
- Safari 14.1+

For environments where `Intl.DisplayNames` is not available, the function will fall back to returning the original tag.

## Implementation Details

```typescript
function getLanguageDisplayName(
  tag: string,
  displayLocale: string = "en"
): string {
  return (
    new Intl.DisplayNames([displayLocale], { type: "language" }).of(tag) || tag
  );
}
```

## Usage Notes

### Common Use Cases

- Displaying a user-friendly name for language selection menus
- Showing the current language in a language switcher
- Providing accessible language names for screen readers

### Limitations

- The function depends on the browser's implementation of `Intl.DisplayNames`
- Some less common language tags may not have localized names
- Region names may not be included in all browser implementations

## Related Functions

- [`parseTag`](/api/parse-tag) - For parsing a language tag into its components
- [`validateLanguageTag`](/api/validate-language-tag) - For validating a language tag before displaying its name
