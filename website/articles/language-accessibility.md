# Language Tags and Accessibility

Proper language identification is a fundamental aspect of web accessibility. This article explores why BCP-47 language tags are essential for users of assistive technologies and how they impact compliance with accessibility standards.

## The Accessibility Impact of Language Tags

According to the [WebAIM Million report](https://webaim.org/projects/million/), missing or incorrect language identification is consistently one of the most common accessibility issues found on websites. In fact, the 2023 report found that **approximately 33% of home pages** lack a valid language definition.

This widespread issue has serious implications for users of assistive technologies.

## How Screen Readers Use Language Tags

Screen readers rely on language tags to determine:

1. **Pronunciation rules** to apply when reading content aloud
2. **Voice and accent** selection for different languages
3. **Handling of special characters** and abbreviations

When language is incorrectly tagged or not tagged at all:

```html
<!-- Missing language tag -->
<html>
  <p>Hello world</p>
  <p>Bonjour le monde</p>
</html>
```

Screen readers must guess the language, often leading to:

- Mispronounced words
- Incorrect intonation
- Unintelligible content for users

## Example: Language Tag Impact on Pronunciation

Consider how these French words would be pronounced by an English screen reader:

| Word        | With French Tag      | Without Tag (Default to English) |
| ----------- | -------------------- | -------------------------------- |
| bonjour     | bon-ZHOOR            | BON-jower or BON-jour            |
| merci       | mair-SEE             | MER-sigh or MER-see              |
| réservation | ray-zair-vah-see-OHN | rez-er-VAY-shun                  |

This demonstrates why marking language changes is crucial:

```html
<html lang="en">
  <p>The French word <span lang="fr">bonjour</span> means hello.</p>
</html>
```

## WebAIM Million Report Findings

The WebAIM Million project, which analyzes the accessibility of the top one million home pages, consistently finds language-related issues:

- **33.1%** of home pages lack a valid language definition
- Pages with proper language tags have **28% fewer** detected accessibility errors overall
- Language identification issues affect an estimated **94 million users** worldwide who rely on screen readers

## WCAG Requirements for Language Tags

The Web Content Accessibility Guidelines (WCAG) include specific success criteria for language:

### WCAG 2.1 Success Criterion 3.1.1: Language of Page (Level A)

> "The default human language of each Web page can be programmatically determined."

This requires:

```html
<html lang="es-MX">
  <!-- Content in Mexican Spanish -->
</html>
```

### WCAG 2.1 Success Criterion 3.1.2: Language of Parts (Level AA)

> "The human language of each passage or phrase in the content can be programmatically determined except for proper names, technical terms, words of indeterminate language, and words or phrases that have become part of the vernacular of the immediately surrounding text."

This requires:

```html
<html lang="en">
  <p>In Spanish, hello is <span lang="es">hola</span>.</p>
</html>
```

## Real User Impact Stories

### Case Study: Screen Reader User Experience

Maria, a blind university student who uses a screen reader, describes how language tags affect her experience:

> "When websites don't tag their language properly, my screen reader tries to read Spanish using English pronunciation rules. It becomes almost impossible to understand. The difference between a properly tagged page and one without tags is like night and day for me."

### Case Study: Cognitive Disabilities

For users with certain cognitive disabilities, proper language identification helps translation tools and reading aids function correctly:

> "I have dyslexia and use specialized software to help me read. When pages don't have proper language tags, my software can't apply the right reading rules, and everything becomes much more difficult to understand." - Alex, university student with dyslexia

## Implementing Language Tags for Accessibility

### 1. Basic Implementation

```html
<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <title>Deutsche Webseite</title>
  </head>
  <body>
    <!-- German content -->
  </body>
</html>
```

### 2. Marking Language Changes

```html
<html lang="en">
  <body>
    <p>Here is a famous quote in German:</p>
    <blockquote lang="de">
      <p>Ich bin ein Berliner.</p>
    </blockquote>
    <p>Which means "I am a Berliner."</p>
  </body>
</html>
```

### 3. Using ally-bcp-47 to Validate

```javascript
import { isValid } from "ally-bcp-47";

// Accessibility check for language tags
function checkLanguageTags() {
  // Check document language
  const htmlLang = document.documentElement.getAttribute("lang");

  if (!htmlLang) {
    console.error(
      "Missing lang attribute on html element - WCAG 3.1.1 failure"
    );
    return false;
  }

  if (!isValid(htmlLang)) {
    console.error(`Invalid language tag: ${htmlLang} - WCAG 3.1.1 failure`);
    return false;
  }

  // Check language of parts
  const elementsWithLang = document.querySelectorAll("[lang]:not(html)");
  let allValid = true;

  elementsWithLang.forEach((element) => {
    const langAttr = element.getAttribute("lang");
    if (!isValid(langAttr)) {
      console.error(`Invalid language tag: ${langAttr} on element:`, element);
      allValid = false;
    }
  });

  return allValid;
}
```

## Accessibility Testing for Language

To ensure your language tags are helping rather than hurting accessibility:

1. **Automated testing**: Use tools like axe, WAVE, or Lighthouse to check for missing language tags
2. **Screen reader testing**: Test how your content sounds in different screen readers (NVDA, JAWS, VoiceOver)
3. **Validation**: Use ally-bcp-47 to validate all language tags on your site
4. **Manual review**: Check that all language changes within content are properly marked

## Accessibility Benefits Beyond Screen Readers

Proper language tags also benefit:

- **Translation tools**: Better automatic translation of content
- **Voice control software**: Improved recognition of commands and text input
- **Read-aloud features**: Correct pronunciation in browser read-aloud functionality
- **Dictionary and reference tools**: Correct language detection for lookups

## Conclusion

Implementing correct BCP-47 language tags is one of the simplest yet most impactful accessibility improvements you can make to your website. Despite being relatively easy to fix, language identification remains one of the most common accessibility failures according to the WebAIM Million report.

By using ally-bcp-47 to validate and canonicalize your language tags, you can ensure that all users, including those with disabilities, have equal access to your content.

Remember: proper language tagging isn't just about compliance—it's about creating an inclusive experience for millions of users who rely on assistive technologies to access the web.
