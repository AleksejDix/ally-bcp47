# Common Language Tag Mistakes

Implementing BCP-47 language tags correctly is crucial for accessibility and internationalization, but several common mistakes can undermine even well-intentioned efforts. This article identifies frequent errors and explains how to avoid them.

## Confusing Country Codes and Language Codes

One of the most common mistakes is confusing country codes with language codes.

### The Ukraine/Ukrainian Confusion

```html
<!-- INCORRECT: Using country code for language -->
<html lang="ua">
  <!-- Content in Ukrainian -->
</html>
```

This is incorrect because:

- `ua` is the ISO 3166 country code for Ukraine
- The correct language code for Ukrainian is `uk`

Correct implementation:

```html
<!-- CORRECT: Using proper language code -->
<html lang="uk">
  <!-- Content in Ukrainian -->
</html>
```

### Other Common Country/Language Confusions

| Incorrect | Correct | Explanation                                                   |
| --------- | ------- | ------------------------------------------------------------- |
| `cz`      | `cs`    | Czech language is `cs`, `cz` is obsolete country code         |
| `gr`      | `el`    | Greek language is `el`, `gr` is the country code for Greece   |
| `dk`      | `da`    | Danish language is `da`, `dk` is the country code for Denmark |
| `jp`      | `ja`    | Japanese language is `ja`, `jp` is the country code for Japan |

## Using Incorrect Separators

```html
<!-- INCORRECT: Using underscore instead of hyphen -->
<html lang="en_US">
  <!-- Content in American English -->
</html>
```

BCP-47 requires hyphens, not underscores:

```html
<!-- CORRECT: Using hyphen as separator -->
<html lang="en-US">
  <!-- Content in American English -->
</html>
```

## Incorrect Capitalization

```html
<!-- INCORRECT: Using uppercase for language part -->
<html lang="EN-us">
  <!-- Mixed capitalization -->
</html>
```

While BCP-47 is case-insensitive in parsing, the canonical form uses:

- Lowercase for language subtags (first part)
- Uppercase for region subtags (country part)

```html
<!-- CORRECT: Canonical capitalization -->
<html lang="en-US">
  <!-- Lowercase language, uppercase region -->
</html>
```

## Using Full Language Names Instead of Codes

```html
<!-- INCORRECT: Using language name -->
<html lang="english">
  <!-- Content in English -->
</html>
```

Language tags must use ISO codes, not language names:

```html
<!-- CORRECT: Using ISO language code -->
<html lang="en">
  <!-- Content in English -->
</html>
```

## Missing Regional Subtags When Needed

```html
<!-- POTENTIALLY INSUFFICIENT: Generic Spanish -->
<html lang="es">
  <!-- Content in Mexican Spanish with region-specific terms -->
</html>
```

When content is specific to a regional variant, include the regional subtag:

```html
<!-- BETTER: Specifying regional variant -->
<html lang="es-MX">
  <!-- Content in Mexican Spanish -->
</html>
```

## Applying Tags Inconsistently Across a Site

A common implementation error is using different formats across the same site:

```html
<!-- Homepage uses one format -->
<html lang="en-US">
  <!-- Content -->
</html>

<!-- Another page uses a different format -->
<html lang="en_US">
  <!-- Content -->
</html>

<!-- Yet another page uses another format -->
<html lang="EN">
  <!-- Content -->
</html>
```

Consistency is crucial. Use canonicalized tags across your entire site:

```javascript
import { canonicalizeTag } from "ally-bcp-47";

// Ensure consistent language tag format across the site
function setPageLanguage(langTag) {
  const canonicalLang = canonicalizeTag(langTag);
  document.documentElement.setAttribute("lang", canonicalLang);
}
```

## Incorrectly Formatted Script Subtags

```html
<!-- INCORRECT: Lowercase script tag -->
<html lang="zh-hans">
  <!-- Simplified Chinese -->
</html>
```

Script subtags should be Title Case (first letter uppercase, rest lowercase):

```html
<!-- CORRECT: Properly capitalized script tag -->
<html lang="zh-Hans">
  <!-- Simplified Chinese -->
</html>
```

## Missing Language Tags Entirely

According to the [WebAIM Million report](https://webaim.org/projects/million/), approximately 33% of home pages lack any language definition:

```html
<!-- INCORRECT: Missing lang attribute -->
<html>
  <!-- Content in some language -->
</html>
```

Every HTML document should have a language tag:

```html
<!-- CORRECT: Including lang attribute -->
<html lang="en">
  <!-- Content in English -->
</html>
```

## Not Marking Language Changes Within Content

When content contains phrases in different languages, each should be properly tagged:

```html
<!-- INCORRECT: No lang attribute on foreign phrases -->
<p>The French expression "c'est la vie" means "that's life".</p>
```

Correct approach:

```html
<!-- CORRECT: Marking language changes -->
<p>
  The French expression <span lang="fr">c'est la vie</span> means "that's life".
</p>
```

## Using Deprecated Tags

```html
<!-- INCORRECT: Using deprecated tag -->
<html lang="iw">
  <!-- Content in Hebrew -->
</html>
```

Some language codes have been deprecated and replaced:

| Deprecated | Current | Language   |
| ---------- | ------- | ---------- |
| `iw`       | `he`    | Hebrew     |
| `in`       | `id`    | Indonesian |
| `ji`       | `yi`    | Yiddish    |

Always use current codes:

```html
<!-- CORRECT: Using current code -->
<html lang="he">
  <!-- Content in Hebrew -->
</html>
```

## Unnecessarily Complex Tags

```html
<!-- UNNECESSARILY COMPLEX -->
<html lang="en-US-u-co-phonebk-x-private">
  <!-- Simple English content with unnecessary extensions -->
</html>
```

For most content, simpler tags are better:

```html
<!-- BETTER: Simpler tag that covers actual content needs -->
<html lang="en-US">
  <!-- Simple English content -->
</html>
```

## Validation and Detection

To prevent these common mistakes, use ally-bcp-47's validation tools:

```javascript
import { isValid, parseTag, canonicalizeTag } from "ally-bcp-47";

function checkLanguageTag(tag) {
  if (!isValid(tag)) {
    console.error(`Invalid language tag: ${tag}`);
    return false;
  }

  // Parse to check components
  const parsed = parseTag(tag);

  // Common error detection
  if (parsed.language === "ua" && !parsed.region) {
    console.warn(
      "Possible error: 'ua' is a country code. Did you mean 'uk' for Ukrainian?"
    );
  }

  // Return canonical form
  return canonicalizeTag(tag);
}
```

## Real-World Examples of Common Mistakes

### Example 1: Major News Website

A major international news organization had this in their HTML:

```html
<html lang="en_GB">
  <!-- Content in British English -->
</html>
```

The underscore caused some screen readers to default to their primary language setting rather than using British English pronunciation.

### Example 2: E-commerce Site

An e-commerce site serving multiple markets had:

```html
<!-- German site -->
<html lang="de_DE">
  <!-- German content -->
</html>

<!-- Austrian site -->
<html lang="de_AT">
  <!-- Austrian German content -->
</html>

<!-- Swiss site -->
<html lang="de_CH">
  <!-- Swiss German content -->
</html>
```

The underscore separator meant that screen readers ignored the regional differences, and search engines couldn't properly index the region-specific content.

### Example 3: Government Website

A Ukrainian government website incorrectly used:

```html
<html lang="ua">
  <!-- Content in Ukrainian -->
</html>
```

This caused screen readers to fall back to their default language since "ua" is not a valid language code, making the content inaccessible to visually impaired Ukrainian speakers.

## Conclusion

Common language tag mistakes can significantly impact accessibility, SEO, and user experience. By using the ally-bcp-47 library to validate and canonicalize your language tags, you can avoid these pitfalls and ensure your content is properly identified for all users and systems.

Remember to:

1. Use hyphens, not underscores
2. Use language codes, not country codes for languages
3. Follow proper capitalization conventions
4. Include regional subtags when content is region-specific
5. Be consistent across your entire site
6. Mark language changes within content
7. Use current, not deprecated codes

Proper language tagging is a simple but crucial aspect of creating globally accessible web content.
