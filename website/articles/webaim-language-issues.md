# The WebAIM Million Report: Language Tags and Web Accessibility

The WebAIM Million report continues to highlight persistent accessibility issues across the web. As shown in recent data, language-related issues affect 17% of home pages, making it a significant accessibility concern despite being one of the easiest to fix with proper implementation.

## Common Accessibility Issues by Prevalence

The latest WebAIM Million report reveals several critical accessibility issues affecting websites today:

1. **Low Contrast (80%)**: The most pervasive issue, with four out of five websites failing to maintain sufficient contrast between text and background colors.

2. **Image Accessibility (55%)**: More than half of websites have missing or inadequate alt text for images, making content inaccessible to screen reader users.

3. **Link Purpose (48%)**: Nearly half of all websites have links that don't clearly indicate their purpose out of context.

4. **Form Labels (44%)**: Missing or improperly associated form labels affect almost half of surveyed websites.

5. **Button Accessibility (28%)**: More than a quarter of websites have buttons without proper accessible names.

6. **Language Identification (17%)**: While affecting fewer sites than other issues, improper language tagging remains a significant barrier to accessibility.

## The Language Tag Problem

At 17%, language identification issues might appear less critical than other accessibility failures. However, this statistic is particularly troubling because:

1. Language tags are incredibly simple to implement correctly
2. They're essential for screen readers to select the appropriate voice and pronunciation
3. They're required for WCAG compliance at even the most basic level (A)

When a screen reader encounters content without proper language tags, it must guess the language, often resulting in mispronunciations that render content unintelligible to users relying on audio output.

## Real-World Impact

To understand the real-world impact of missing language tags, consider these scenarios:

### Scenario 1: Multilingual Content

A website contains both English and Spanish content but lacks proper language tags. A screen reader user who is blind and fluent in both languages encounters:

```html
<!-- Without proper language tagging -->
<p>Welcome to our website. Bienvenido a nuestro sitio web.</p>
```

The screen reader attempts to pronounce the Spanish words using English pronunciation rules, resulting in a confusing and potentially incomprehensible experience.

### Scenario 2: Specialized Terminology

A scientific website contains Latin species names without proper language markup:

```html
<!-- Without proper language tagging -->
<p>
  The common house cat (Felis catus) is a domestic species of small carnivorous
  mammal.
</p>
```

Without language tagging, the screen reader might mispronounce "Felis catus," making the scientific content less accessible.

## The Business Case for Proper Language Tagging

Besides accessibility benefits, proper language tagging using BCP-47 standards provides:

- **Enhanced SEO**: Search engines better understand and appropriately index your content
- **Improved user experience**: Content is presented with correct pronunciations, hyphenation, and formatting
- **International market reach**: Sites with proper language identification are more accessible to global audiences
- **Reduced legal risk**: Proper language tagging is required for compliance with accessibility laws worldwide

## Implementation with ally-bcp-47

Libraries like ally-bcp-47 make it straightforward to validate and canonicalize language tags. Implementing proper language identification requires only a few simple steps:

1. **Document-level language**: Ensure the main document language is specified with the `lang` attribute on the HTML element

   ```html
   <html lang="en-US"></html>
   ```

2. **Language changes**: Mark any language changes within content with appropriate lang attributes

   ```html
   <p>The French word <span lang="fr">bonjour</span> means hello.</p>
   ```

3. **Use valid BCP-47 tags**: Always use proper language codes following the BCP-47 standard

   ```html
   <!-- Correct -->
   <html lang="zh-Hans-CN">
     <!-- Incorrect -->
     <html lang="zh_CN">
       <html lang="chinese"></html>
     </html>
   </html>
   ```

4. **Validate your tags**: Use ally-bcp-47 to validate and canonicalize language tags

   ```javascript
   import { isValid, canonicalizeTag } from "ally-bcp-47";

   function validateDocumentLang() {
     const htmlLang = document.documentElement.lang;

     if (!htmlLang) {
       console.error("Missing lang attribute on HTML element");
       return false;
     }

     if (!isValid(htmlLang)) {
       console.error(`Invalid language tag: ${htmlLang}`);
       return false;
     }

     // Ensure canonical form
     const canonicalLang = canonicalizeTag(htmlLang);
     document.documentElement.lang = canonicalLang;

     return true;
   }
   ```

## Conclusion

While language tagging issues appear less prevalent than contrast or image accessibility problems, they remain a significant barrier for millions of users. The good news is that proper language tagging is among the easiest accessibility issues to fix, with immediate benefits for accessibility, SEO, and user experience.

As web accessibility issues continue to trend upward (up 3.7% according to the latest report), focusing on straightforward fixes like proper language tagging offers an effective starting point for improving overall accessibility compliance.

By using tools like ally-bcp-47, developers can easily validate and canonicalize language tags, ensuring their websites are accessible to all users, regardless of language or disability.
