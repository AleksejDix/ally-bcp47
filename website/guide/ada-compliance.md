# ADA Compliance

The Americans with Disabilities Act (ADA) requires that digital content be accessible to people with disabilities. Proper language identification is a crucial component of this accessibility. The `ally-bcp-47` library helps ensure ADA compliance by validating language tags.

## Why Language Tags Matter for ADA

Proper language identification is essential for assistive technologies like screen readers:

1. **Pronunciation**: Screen readers use language tags to determine how to pronounce text
2. **Switching Languages**: Enables correct pronunciation when content uses multiple languages
3. **Supporting Assistive Tools**: Helps translation tools and other assistive technologies

## ADA Requirements for Language Identification

The ADA follows the Web Content Accessibility Guidelines (WCAG), which includes specific success criteria for language identification:

- **3.1.1 Language of Page** (Level A): The default human language of each web page can be programmatically determined.
- **3.1.2 Language of Parts** (Level AA): The human language of each passage or phrase in the content can be programmatically determined.

## How ally-bcp-47 Helps with ADA Compliance

The `ally-bcp-47` library helps ensure ADA compliance by:

1. **Validating Language Tags**: Ensuring language tags are valid and well-formed
2. **Providing Error Details**: Offering helpful messages when tags are invalid
3. **Suggesting Corrections**: Providing replacement suggestions for common mistakes
4. **Canonicalizing Tags**: Converting tags to their standard form

## Implementation Examples for ADA Compliance

### HTML lang Attribute Validation

```typescript
import { isValid, canonicalizeTag } from "ally-bcp-47";

function validateHtmlLangForADA(htmlElement) {
  // Check if the lang attribute is present
  if (!htmlElement.hasAttribute("lang")) {
    return {
      isValid: false,
      message: "Missing lang attribute. Required for ADA compliance.",
    };
  }

  const langValue = htmlElement.getAttribute("lang");

  // Check if the lang value is valid
  if (!isValid(langValue)) {
    return {
      isValid: false,
      message: `Invalid lang attribute value: "${langValue}". Use a valid BCP-47 language tag.`,
    };
  }

  // Canonicalize the lang value
  const canonical = canonicalizeTag(langValue);
  if (canonical !== langValue) {
    htmlElement.setAttribute("lang", canonical);
    return {
      isValid: true,
      message: `Lang attribute updated to canonical form: "${canonical}"`,
    };
  }

  return {
    isValid: true,
    message: "Valid lang attribute",
  };
}
```

### Multi-language Content Management

```typescript
import { validateLanguageTag } from "ally-bcp-47";

function processMultilingualContent(content, languageTag) {
  const validation = validateLanguageTag(languageTag);

  if (!validation.isValid) {
    return {
      error: "ADA Compliance Error: Invalid language tag",
      details: validation.errors,
    };
  }

  // Process the content with the validated language tag
  return {
    content,
    languageTag: validation.tag.tag, // Use the canonicalized form
    html: `<span lang="${validation.tag.tag}">${content}</span>`,
  };
}
```

### Page Language Validation

```typescript
import { isValid } from "ally-bcp-47";

function validatePageForADA() {
  const htmlElement = document.querySelector("html");
  const langAttr = htmlElement.getAttribute("lang");

  if (!langAttr) {
    console.error(
      "ADA Compliance Error: Missing lang attribute on HTML element"
    );
    return false;
  }

  if (!isValid(langAttr)) {
    console.error(
      `ADA Compliance Error: Invalid lang attribute value: "${langAttr}"`
    );
    return false;
  }

  // Check language of parts (for multilingual content)
  const elementsWithLang = document.querySelectorAll("[lang]");
  let allValid = true;

  elementsWithLang.forEach((element) => {
    const elementLang = element.getAttribute("lang");
    if (!isValid(elementLang)) {
      console.error(
        `ADA Compliance Error: Invalid lang attribute on element: "${elementLang}"`
      );
      allValid = false;
    }
  });

  return allValid;
}
```

## Testing for ADA Compliance

The `ally-bcp-47` library includes specific tests for ADA compliance:

```typescript
import { validateLanguageTag } from "ally-bcp-47";

// Test common US languages needed for ADA compliance
const adaLanguages = [
  "en",
  "es",
  "zh",
  "vi",
  "ko",
  "tl",
  "ru",
  "ar",
  "ht",
  "fr",
  "de",
  "it",
  "pt",
  "pl",
  "ur",
  "ja",
];

function testADALanguages() {
  const results = adaLanguages.map((lang) => {
    const validation = validateLanguageTag(lang);
    return {
      language: lang,
      isValid: validation.isValid,
    };
  });

  const allValid = results.every((result) => result.isValid);

  console.log("ADA Language Compliance Check:", allValid ? "PASS" : "FAIL");
  console.table(results);
}
```

## ADA Remediation

If your website or application has language identification issues, `ally-bcp-47` can help with remediation:

1. **Audit**: Scan your content for missing or invalid language tags
2. **Validate**: Use `isValid` to check if existing tags are valid
3. **Correct**: Use `canonicalizeTag` to normalize tags to their proper form
4. **Document**: Update your content guidelines to include proper language tagging

## Next Steps

- [Section 508 Compliance](./section508-compliance) - Learn about Section 508 requirements
- [EAA Compliance](./eaa-compliance) - Understand European Accessibility Act requirements
