# Building an Accessible Language Switcher

A language switcher is a critical component of multilingual websites, allowing users to select their preferred language. This article covers how to implement a language switcher that is accessible, SEO-friendly, and uses BCP-47 language tags correctly.

## Key Requirements for a Language Switcher

An effective language switcher should:

1. Be easily discoverable for all users
2. Properly label languages using BCP-47 tags
3. Maintain the user's current page/context when switching languages
4. Support accessibility features for screen reader users
5. Provide appropriate visual cues for language options
6. Follow SEO best practices with proper `hreflang` attributes

## HTML Implementation

### Basic Language Switcher

```html
<nav aria-label="Language selection">
  <ul>
    <li>
      <a href="/en/" lang="en" hreflang="en">
        <span aria-hidden="true">🇺🇸</span>
        <span>English</span>
      </a>
    </li>
    <li>
      <a href="/es/" lang="es" hreflang="es">
        <span aria-hidden="true">🇪🇸</span>
        <span>Español</span>
      </a>
    </li>
    <li>
      <a href="/fr/" lang="fr" hreflang="fr">
        <span aria-hidden="true">🇫🇷</span>
        <span>Français</span>
      </a>
    </li>
  </ul>
</nav>
```

Key features:

- `aria-label` on the navigation identifies its purpose
- Each language name is written in its own language
- `lang` attribute on each link matches the language of the content
- `hreflang` attribute provides additional metadata for search engines
- Flag icons (optional) have `aria-hidden="true"` to prevent screen readers from announcing them

### Advanced Language Switcher with Current Selection

```html
<div class="language-switcher">
  <button
    aria-expanded="false"
    aria-controls="language-menu"
    id="language-button"
  >
    <span aria-hidden="true">🌐</span>
    <span>Language: </span><span lang="en">English</span>
  </button>

  <ul id="language-menu" role="menu" aria-labelledby="language-button" hidden>
    <li role="none">
      <a
        role="menuitem"
        href="/en/current-page/"
        lang="en"
        hreflang="en"
        aria-current="true"
      >
        <span lang="en">English</span>
        <span class="visually-hidden">(Current language)</span>
      </a>
    </li>
    <li role="none">
      <a role="menuitem" href="/es/current-page/" lang="es" hreflang="es">
        <span lang="es">Español</span>
      </a>
    </li>
    <li role="none">
      <a role="menuitem" href="/fr/current-page/" lang="fr" hreflang="fr">
        <span lang="fr">Français</span>
      </a>
    </li>
  </ul>
</div>
```

Advanced features:

- Dropdown menu implementation with ARIA attributes
- `aria-expanded` state for the toggle button
- `aria-current="true"` marks the currently selected language
- "Current language" text is visually hidden but available to screen readers
- Uses proper menu roles for keyboard navigation support

## Validating Language Tags

Ensure all language tags in your switcher are valid BCP-47 tags:

```javascript
import { isValid, canonicalizeTag } from "ally-bcp-47";

function validateLanguageSwitcher() {
  // Get all language links
  const languageLinks = document.querySelectorAll(".language-switcher a[lang]");

  languageLinks.forEach((link) => {
    const langTag = link.getAttribute("lang");
    const hreflangTag = link.getAttribute("hreflang");

    // Check if lang attribute is valid
    if (!isValid(langTag)) {
      console.error(`Invalid language tag: ${langTag}`);
    }

    // Check if hreflang matches lang
    if (
      hreflangTag &&
      canonicalizeTag(langTag) !== canonicalizeTag(hreflangTag)
    ) {
      console.error(
        `Mismatched lang and hreflang attributes: ${langTag} vs ${hreflangTag}`
      );
    }
  });
}
```

## SEO Considerations

### Adding Alternate Links in `<head>`

To help search engines understand your multilingual content:

```html
<head>
  <link rel="alternate" hreflang="en" href="https://example.com/en/page/" />
  <link rel="alternate" hreflang="es" href="https://example.com/es/page/" />
  <link rel="alternate" hreflang="fr" href="https://example.com/fr/page/" />
  <link
    rel="alternate"
    hreflang="x-default"
    href="https://example.com/en/page/"
  />
</head>
```

The `x-default` value specifies which version to show when no other language version matches the user's preferred language.

### Adding Language Information to Sitemaps

```xml
<url>
  <loc>https://example.com/en/page/</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://example.com/en/page/"/>
  <xhtml:link rel="alternate" hreflang="es" href="https://example.com/es/page/"/>
  <xhtml:link rel="alternate" hreflang="fr" href="https://example.com/fr/page/"/>
</url>
```

## JavaScript Implementation

Here's a complete example of a language switcher with JavaScript for dropdown functionality:

```javascript
// Language switcher functionality
document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("language-button");
  const menu = document.getElementById("language-menu");

  if (!button || !menu) return;

  // Toggle menu visibility
  button.addEventListener("click", () => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", !expanded);
    menu.hidden = expanded;

    // If opening the menu, focus the first item
    if (!expanded) {
      const firstItem = menu.querySelector('[role="menuitem"]');
      if (firstItem) firstItem.focus();
    }
  });

  // Close menu when clicking outside
  document.addEventListener("click", (event) => {
    if (!button.contains(event.target) && !menu.contains(event.target)) {
      button.setAttribute("aria-expanded", "false");
      menu.hidden = true;
    }
  });

  // Keyboard navigation
  menu.addEventListener("keydown", (event) => {
    const items = Array.from(menu.querySelectorAll('[role="menuitem"]'));
    const currentIndex = items.indexOf(document.activeElement);

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        items[(currentIndex + 1) % items.length].focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        items[(currentIndex - 1 + items.length) % items.length].focus();
        break;
      case "Escape":
        event.preventDefault();
        button.setAttribute("aria-expanded", "false");
        menu.hidden = true;
        button.focus();
        break;
    }
  });
});
```

## Regional Variants and Language Choice

Consider which regional variants to offer. Instead of a generic:

```html
<a href="/en/" lang="en" hreflang="en">English</a>
```

You might want to be more specific with regional variants:

```html
<a href="/en-US/" lang="en-US" hreflang="en-US">English (US)</a>
<a href="/en-GB/" lang="en-GB" hreflang="en-GB">English (UK)</a>
```

Use the BCP-47 standard to ensure your language tags are correctly formatted.

## Using Language Names

Display language names in their native form:

| Language | Native Name | BCP-47 Tag |
| -------- | ----------- | ---------- |
| English  | English     | en         |
| Spanish  | Español     | es         |
| French   | Français    | fr         |
| German   | Deutsch     | de         |
| Japanese | 日本語      | ja         |
| Arabic   | العربية     | ar         |
| Chinese  | 中文        | zh         |

## Styling and Placement

### Common Placement Options

1. **Header/Top Navigation**: Most common and expected placement
2. **Footer**: Secondary placement, less visible but expected
3. **Floating Button**: Always visible, good for sites with high international traffic

### Styling Best Practices

- Use sufficient contrast for text
- Make clickable areas large enough for mobile users (minimum 44×44px)
- Consider using ISO language codes alongside language names for clarity
- If using flags, remember they represent countries, not languages

### Example CSS for Basic Styling

```css
.language-switcher {
  position: relative;
}

.language-switcher button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid currentColor;
  border-radius: 4px;
  cursor: pointer;
}

.language-switcher ul {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 100;
  min-width: 200px;
  margin: 0.25rem 0 0;
  padding: 0.5rem 0;
  list-style: none;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.language-switcher a {
  display: block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: inherit;
}

.language-switcher a:hover,
.language-switcher a:focus {
  background: #f5f5f5;
}

.language-switcher a[aria-current="true"] {
  font-weight: bold;
  background: #f0f0f0;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## Server-Side Considerations

### URL Structure Options

1. **Subdirectories**: `example.com/en/`, `example.com/fr/`
2. **Subdomains**: `en.example.com`, `fr.example.com`
3. **Different TLDs**: `example.com`, `example.fr`

Each approach has SEO implications; subdirectories are generally easiest to manage.

### Language Detection

Consider implementing automatic language detection:

```javascript
function detectPreferredLanguage() {
  // Get browser language preferences
  const browserLangs = navigator.languages || [
    navigator.language || navigator.userLanguage,
  ];

  // Our supported languages
  const supportedLangs = ["en-US", "es-ES", "fr-FR", "de-DE"];

  // Try to match, first checking full tags, then just language part
  for (const browserLang of browserLangs) {
    // Check for exact match
    if (supportedLangs.includes(browserLang)) {
      return browserLang;
    }

    // Check for language match (e.g., 'en' for 'en-US')
    const langPart = browserLang.split("-")[0];
    const match = supportedLangs.find((lang) =>
      lang.startsWith(langPart + "-")
    );

    if (match) {
      return match;
    }
  }

  // Default to English if no match
  return "en-US";
}
```

## Respecting User Choice

Once a user selects a language, remember their preference:

```javascript
function setLanguagePreference(langTag) {
  // Store in localStorage
  localStorage.setItem("preferred-language", langTag);

  // Could also set a cookie for server-side use
  document.cookie = `preferred-language=${langTag}; path=/; max-age=31536000; SameSite=Lax`;
}

function getLanguagePreference() {
  // Check localStorage first
  const storedLang = localStorage.getItem("preferred-language");
  if (storedLang) return storedLang;

  // Fall back to detection
  return detectPreferredLanguage();
}
```

## Conclusion

Building an accessible language switcher requires attention to proper BCP-47 language tagging, accessibility features, and SEO best practices. Using ally-bcp-47 to validate your language tags ensures that your language switcher works correctly for all users, including those using assistive technologies.

Remember that a well-implemented language switcher isn't just a UI element—it's a critical component that helps users access content in their preferred language, improving both accessibility and user experience.
