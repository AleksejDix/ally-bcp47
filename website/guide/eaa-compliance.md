# European Accessibility Act Compliance

The European Accessibility Act (EAA) is a directive that aims to improve the functioning of the internal market for accessible products and services by removing barriers created by divergent rules across EU countries. This page explains how proper implementation of BCP-47 language tags helps with EAA compliance.

## Language Tags and the EAA

The European Accessibility Act sets accessibility requirements for products and services, including websites and mobile applications. The EAA is aligned with the Web Content Accessibility Guidelines (WCAG), which include specific requirements for language identification. Properly implemented BCP-47 language tags help satisfy these requirements by:

1. Enabling assistive technologies to render content correctly
2. Supporting proper text-to-speech pronunciation for European languages
3. Facilitating the appropriate presentation of language-specific characters and formatting
4. Ensuring correct localization and translation within EU member states

## Multilingual Requirements in the EU

The European Union has 24 official languages and numerous regional and minority languages. This linguistic diversity creates unique accessibility challenges that proper BCP-47 language tagging can address:

### Official EU Languages

Each of these languages requires correct identification using BCP-47 tags:

```
bg (Bulgarian), cs (Czech), da (Danish), de (German), el (Greek),
en (English), es (Spanish), et (Estonian), fi (Finnish), fr (French),
ga (Irish), hr (Croatian), hu (Hungarian), it (Italian), lt (Lithuanian),
lv (Latvian), mt (Maltese), nl (Dutch), pl (Polish), pt (Portuguese),
ro (Romanian), sk (Slovak), sl (Slovenian), sv (Swedish)
```

### Regional and Minority Languages

The EU also recognizes numerous regional and minority languages that may require specific language tags, such as:

```
ca (Catalan), eu (Basque), gl (Galician), cy (Welsh), gd (Scottish Gaelic),
fy (Western Frisian), br (Breton), and many others
```

## EAA Accessibility Requirements

### Relevant WCAG Success Criteria

The EAA requires compliance with WCAG 2.1 Level AA, which includes:

#### 3.1.1 Language of Page (Level A)

> "The default human language of each Web page can be programmatically determined."

This requires using a valid `lang` attribute on the `<html>` element with a proper BCP-47 language tag:

```html
<html lang="de-DE"></html>
```

#### 3.1.2 Language of Parts (Level AA)

> "The human language of each passage or phrase in the content can be programmatically determined except for proper names, technical terms, words of indeterminate language, and words or phrases that have become part of the vernacular of the immediately surrounding text."

This requires marking content in different languages with appropriate `lang` attributes:

```html
<p>
  Das englische Wort <span lang="en">accessibility</span> bedeutet
  Barrierefreiheit.
</p>
```

## Implementation Guidelines for EAA Compliance

### 1. Primary Language Identification

Always specify the primary language of the document with the appropriate regional variant when applicable:

```html
<html lang="it-IT">
  <!-- Italian as used in Italy -->
  <html lang="de-AT">
    <!-- German as used in Austria -->
    <html lang="fr-BE">
      <!-- French as used in Belgium -->
    </html>
  </html>
</html>
```

### 2. Content in Multiple EU Languages

For content available in multiple European languages, ensure proper language switching mechanisms:

```html
<nav aria-label="Language selection">
  <ul>
    <li><a href="index-de.html" lang="de" hreflang="de">Deutsch</a></li>
    <li><a href="index-fr.html" lang="fr" hreflang="fr">Français</a></li>
    <li><a href="index-es.html" lang="es" hreflang="es">Español</a></li>
  </ul>
</nav>
```

### 3. Multilingual Content Sections

For pages containing multiple languages:

```html
<article>
  <h1 lang="en">EU Accessibility Report</h1>
  <section lang="fr">
    <h2>Résumé en français</h2>
    <p>Ce rapport examine l'accessibilité des sites web gouvernementaux...</p>
  </section>
  <section lang="de">
    <h2>Deutsche Zusammenfassung</h2>
    <p>
      Dieser Bericht untersucht die Barrierefreiheit von Regierungswebsites...
    </p>
  </section>
</article>
```

### 4. Language-Specific Form Controls

For forms accepting input in specific languages:

```html
<fieldset>
  <legend>Contact Information</legend>
  <div>
    <label for="name-en">Name (English)</label>
    <input id="name-en" lang="en" type="text" />
  </div>
  <div>
    <label for="address-fr">Adresse (français)</label>
    <textarea id="address-fr" lang="fr"></textarea>
  </div>
</fieldset>
```

## Common EAA Compliance Issues

### Incorrect Regional Variants

- **Issue**: Using generic language codes without appropriate regional variants
- **Impact**: Content may not be presented with the correct regional conventions
- **Solution**: Use region-specific tags when appropriate

```javascript
import { validateLanguageTag } from "ally-bcp-47";

// Checking for appropriate regional variants
function checkRegionalVariant(element) {
  const lang = element.getAttribute("lang");
  const result = validateLanguageTag(lang);

  if (
    result.isValid &&
    !result.tag?.region &&
    isRegionalContentExpected(element)
  ) {
    console.warn(`Language tag ${lang} doesn't specify a region`);
    return false;
  }
  return true;
}
```

### Missing Language Identification for EU Languages

- **Issue**: Failure to identify languages, especially in multilingual content
- **Impact**: Screen readers may use incorrect pronunciation rules
- **Solution**: Implement a validation check for language attributes

```javascript
import { isValid } from "ally-bcp-47";

// Validate all content in non-primary languages has lang attributes
function validateMultilingualContent() {
  const primaryLang = document.documentElement.getAttribute("lang");

  // Find text likely to be in a different language
  document
    .querySelectorAll("p, h1, h2, h3, h4, h5, h6, span, div")
    .forEach((element) => {
      if (detectDifferentLanguage(element.textContent, primaryLang)) {
        if (!element.hasAttribute("lang")) {
          console.error(
            "Content appears to be in a different language but lacks a lang attribute:",
            element
          );
        } else if (!isValid(element.getAttribute("lang"))) {
          console.error("Invalid language tag:", element.getAttribute("lang"));
        }
      }
    });
}
```

### Canonicalization for Consistency

Ensure consistency in language tagging across your application:

```javascript
import { canonicalizeTag } from "ally-bcp-47";

// Normalize all language tags
document.querySelectorAll("[lang]").forEach((element) => {
  const lang = element.getAttribute("lang");
  const canonical = canonicalizeTag(lang);

  if (lang !== canonical) {
    console.info(`Normalizing language tag from ${lang} to ${canonical}`);
    element.setAttribute("lang", canonical);
  }
});
```

## Testing for EAA Compliance

### Automated Testing

Include language tag validation in your accessibility tests:

```javascript
// Example Jest test for EU-specific language tags
test("All EU language links have correct lang and hreflang attributes", () => {
  const languageSwitcher = document.querySelector(
    'nav[aria-label="Language selection"]'
  );

  if (languageSwitcher) {
    const links = languageSwitcher.querySelectorAll("a[hreflang]");

    links.forEach((link) => {
      const lang = link.getAttribute("lang");
      const hreflang = link.getAttribute("hreflang");

      // Check if attributes exist and match
      expect(lang).toBeTruthy();
      expect(hreflang).toBeTruthy();
      expect(lang).toEqual(hreflang);

      // Validate the language tag
      const { isValid } = validateLanguageTag(lang);
      expect(isValid).toBe(true);
    });
  }
});
```

### Manual Testing

Include these checks in your manual accessibility testing:

1. Verify the document has a valid `lang` attribute with appropriate regional variant
2. Ensure all content in different languages has appropriate `lang` attributes
3. Test with screen readers to confirm proper pronunciation of different EU languages
4. Test language switching mechanisms to ensure they function correctly
5. Verify that text-to-speech works correctly with various European languages

## Conclusion

Proper implementation of BCP-47 language tags is essential for EAA compliance, especially given the EU's linguistic diversity. The `ally-bcp-47` library provides tools to ensure your language tags are valid and consistent, helping you meet European accessibility requirements while improving the experience for users across the EU.

By following these guidelines and using `ally-bcp-47` for validation and canonicalization, you can ensure that your applications handle the complexities of European languages correctly, supporting both EAA compliance and better accessibility for all users across the European Union.
