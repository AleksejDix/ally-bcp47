# Section 508 Compliance

Section 508 is a U.S. federal law that requires federal agencies to make their electronic and information technology accessible to people with disabilities. This page explains how proper use of BCP-47 language tags contributes to Section 508 compliance.

## Language Tags and Section 508

Section 508 standards align with the Web Content Accessibility Guidelines (WCAG), which include requirements for language identification. Properly implemented BCP-47 language tags help satisfy these requirements by:

1. Enabling screen readers to use the correct pronunciation rules
2. Supporting proper text-to-speech rendering of content
3. Facilitating automatic translation tools
4. Ensuring correct rendering of language-specific characters and formatting

## Relevant WCAG Success Criteria

Section 508 compliance incorporates WCAG 2.0 Level AA requirements, which include:

### 3.1.1 Language of Page (Level A)

> "The default human language of each Web page can be programmatically determined."

This requires using a valid `lang` attribute on the `<html>` element with a proper BCP-47 language tag:

```html
<html lang="en-US"></html>
```

### 3.1.2 Language of Parts (Level AA)

> "The human language of each passage or phrase in the content can be programmatically determined except for proper names, technical terms, words of indeterminate language, and words or phrases that have become part of the vernacular of the immediately surrounding text."

This requires using the `lang` attribute with valid BCP-47 language tags on elements containing content in a different language than the page's default:

```html
<p>The French word <span lang="fr">bonjour</span> means hello.</p>
```

## Implementation Guidelines for Section 508 Compliance

To ensure Section 508 compliance with respect to language identification:

### 1. Document Language

Always specify the primary language of the document using a valid BCP-47 language tag in the `lang` attribute of the `<html>` element:

```html
<html lang="en-US"></html>
```

### 2. Content in Multiple Languages

When content includes text in multiple languages, use the `lang` attribute with appropriate BCP-47 language tags to identify each language segment:

```html
<p lang="en">
  This contract is available in <span lang="es">español</span> and
  <span lang="fr">français</span>.
</p>
```

### 3. Form Controls and Accessibility

For form controls that accept input in a specific language, use the `lang` attribute to indicate the expected language:

```html
<label for="name-fr">Nom (français)</label>
<input id="name-fr" lang="fr" type="text" />
```

### 4. Dynamic Content

For dynamically loaded content, ensure language tags are applied appropriately:

```javascript
// Add proper lang attribute when loading content
const contentElement = document.getElementById("dynamic-content");
contentElement.setAttribute("lang", "es-MX");
contentElement.textContent = "El contenido en español mexicano";
```

## Common Section 508 Compliance Issues

### Incorrect or Missing Language Tags

- **Issue**: No language specification or incorrect language code used
- **Impact**: Screen readers may use incorrect pronunciation rules
- **Solution**: Use `ally-bcp-47` to validate language tags before implementation

```javascript
import { isValid } from "ally-bcp-47";

function validateHtmlLang(element) {
  const lang = element.getAttribute("lang");
  if (!lang || !isValid(lang)) {
    console.warn(`Invalid or missing lang attribute: ${lang}`);
    return false;
  }
  return true;
}
```

### Inconsistent Language Identification

- **Issue**: Different parts of the interface use inconsistent language tags for the same language
- **Impact**: Inconsistent user experience and potential accessibility barriers
- **Solution**: Use canonicalization to ensure consistency

```javascript
import { canonicalizeTag } from "ally-bcp-47";

// Ensure all language tags are in canonical form
document.querySelectorAll("[lang]").forEach((element) => {
  const lang = element.getAttribute("lang");
  element.setAttribute("lang", canonicalizeTag(lang));
});
```

### Language Tag Validation in Development

Integrate language tag validation into your development workflow:

```javascript
import { validateLanguageTag } from "ally-bcp-47";

// Example validation in an accessibility testing function
function testAccessibility() {
  const htmlLang = document.documentElement.getAttribute("lang");
  const result = validateLanguageTag(htmlLang);

  if (!result.isValid) {
    console.error("Document language tag is not valid:", result.errors);
  }

  // Check language of parts
  document.querySelectorAll("[lang]:not(html)").forEach((element) => {
    const partLang = element.getAttribute("lang");
    const partResult = validateLanguageTag(partLang);

    if (!partResult.isValid) {
      console.error(
        `Invalid language tag ${partLang} on element:`,
        element,
        partResult.errors
      );
    }
  });
}
```

## Testing for Section 508 Compliance

### Automated Testing

Include language tag validation in your automated accessibility tests:

```javascript
// Example Jest test for language tag validation
test("Document has valid language tag", () => {
  const htmlLang = document.documentElement.getAttribute("lang");
  const { isValid } = validateLanguageTag(htmlLang);
  expect(isValid).toBe(true);
});

test("All language parts have valid language tags", () => {
  document.querySelectorAll("[lang]:not(html)").forEach((element) => {
    const partLang = element.getAttribute("lang");
    const { isValid } = validateLanguageTag(partLang);
    expect(isValid).toBe(true);
  });
});
```

### Manual Testing

Include these checks in your manual accessibility testing:

1. Verify the document has a valid `lang` attribute on the `<html>` element
2. Ensure all content in different languages has appropriate `lang` attributes
3. Test with screen readers to confirm correct pronunciation of different language segments
4. Verify that translation tools correctly identify the language of different parts

## Conclusion

Proper implementation of BCP-47 language tags is an essential component of Section 508 compliance. The `ally-bcp-47` library provides tools to ensure your language tags are valid, helping you meet accessibility requirements while improving the user experience for people using assistive technologies.

By following these guidelines and using the validation tools provided by the library, you can ensure that your applications correctly identify language, supporting both Section 508 compliance and better accessibility for all users.
