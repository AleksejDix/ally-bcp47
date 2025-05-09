# React Implementation Guide

This guide demonstrates how to effectively integrate ally-bcp-47 into your React applications for proper language tag validation and management.

## Installation

First, install the ally-bcp-47 package:

```bash
npm install ally-bcp-47
# or
yarn add ally-bcp-47
```

## Basic Usage

Here's a simple example of validating a language tag in a React component:

```jsx
import React, { useState } from "react";
import { isValid, canonicalizeTag } from "ally-bcp-47";

function LanguageSelector() {
  const [languageTag, setLanguageTag] = useState("en-US");
  const [error, setError] = useState("");

  const handleLanguageChange = (e) => {
    const value = e.target.value;
    setLanguageTag(value);

    if (!isValid(value)) {
      setError(`Invalid language tag: ${value}`);
    } else {
      setError("");
      // You might want to set the canonical form
      const canonicalTag = canonicalizeTag(value);
      // Do something with the canonical tag
    }
  };

  return (
    <div>
      <label htmlFor="language-input">Language Tag:</label>
      <input
        id="language-input"
        type="text"
        value={languageTag}
        onChange={handleLanguageChange}
        aria-invalid={!!error}
        aria-describedby={error ? "language-error" : undefined}
      />
      {error && (
        <p id="language-error" className="error">
          {error}
        </p>
      )}
    </div>
  );
}

export default LanguageSelector;
```

## Creating a Custom Hook

For better reusability, you can create a custom hook:

```jsx
// useBCP47Validation.js
import { useState, useEffect } from "react";
import { isValid, isWellFormed, canonicalizeTag, parseTag } from "ally-bcp-47";

export function useBCP47Validation(initialTag = "") {
  const [tag, setTag] = useState(initialTag);
  const [isValidTag, setIsValidTag] = useState(false);
  const [isWellFormedTag, setIsWellFormedTag] = useState(false);
  const [canonicalForm, setCanonicalForm] = useState("");
  const [parsedTag, setParsedTag] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check validity
    const validTag = isValid(tag);
    setIsValidTag(validTag);

    // Check well-formedness
    const wellFormedTag = isWellFormed(tag);
    setIsWellFormedTag(wellFormedTag);

    // Get canonical form if well-formed
    if (wellFormedTag) {
      try {
        const canonical = canonicalizeTag(tag);
        setCanonicalForm(canonical);
      } catch (e) {
        setCanonicalForm("");
      }
    } else {
      setCanonicalForm("");
    }

    // Parse tag if well-formed
    if (wellFormedTag) {
      try {
        const parsed = parseTag(tag);
        setParsedTag(parsed);
      } catch (e) {
        setParsedTag(null);
      }
    } else {
      setParsedTag(null);
    }

    // Set error message
    if (!wellFormedTag) {
      setError("The language tag is not well-formed.");
    } else if (!validTag) {
      setError("The language tag is well-formed but not valid.");
    } else {
      setError("");
    }
  }, [tag]);

  return {
    tag,
    setTag,
    isValidTag,
    isWellFormedTag,
    canonicalForm,
    parsedTag,
    error,
  };
}
```

Then use it in your components:

```jsx
import React from "react";
import { useBCP47Validation } from "./useBCP47Validation";

function LanguageForm() {
  const {
    tag,
    setTag,
    isValidTag,
    isWellFormedTag,
    canonicalForm,
    parsedTag,
    error,
  } = useBCP47Validation("en-US");

  return (
    <div>
      <label htmlFor="lang-input">Language Tag:</label>
      <input
        id="lang-input"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        aria-invalid={!!error}
        aria-describedby="lang-status"
      />

      <div id="lang-status">
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <p className="success">Valid language tag!</p>
        )}
      </div>

      {isWellFormedTag && (
        <div>
          <p>Canonical form: {canonicalForm}</p>
          {parsedTag && (
            <dl>
              <dt>Language:</dt>
              <dd>{parsedTag.language}</dd>
              {parsedTag.script && (
                <>
                  <dt>Script:</dt>
                  <dd>{parsedTag.script}</dd>
                </>
              )}
              {parsedTag.region && (
                <>
                  <dt>Region:</dt>
                  <dd>{parsedTag.region}</dd>
                </>
              )}
            </dl>
          )}
        </div>
      )}
    </div>
  );
}
```

## Integration with React Context

For application-wide language settings, you can use React Context:

```jsx
// LanguageContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { isValid, canonicalizeTag } from "ally-bcp-47";

const LanguageContext = createContext();

export function LanguageProvider({ children, defaultLanguage = "en" }) {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Try to get from localStorage or use browser language
    const savedLang = localStorage.getItem("preferredLanguage");
    if (savedLang && isValid(savedLang)) {
      return canonicalizeTag(savedLang);
    }

    // Try to use browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang && isValid(browserLang)) {
      return canonicalizeTag(browserLang);
    }

    // Fallback to default
    return defaultLanguage;
  });

  // Update HTML lang attribute when language changes
  useEffect(() => {
    if (isValid(currentLanguage)) {
      document.documentElement.lang = currentLanguage;
      localStorage.setItem("preferredLanguage", currentLanguage);
    }
  }, [currentLanguage]);

  const setLanguage = (langTag) => {
    if (!isValid(langTag)) {
      console.error(`Invalid language tag: ${langTag}`);
      return false;
    }

    const canonicalLang = canonicalizeTag(langTag);
    setCurrentLanguage(canonicalLang);
    return true;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
```

Usage in your application:

```jsx
// App.js
import React from "react";
import { LanguageProvider } from "./LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import MainContent from "./MainContent";

function App() {
  return (
    <LanguageProvider defaultLanguage="en-US">
      <header>
        <LanguageSwitcher />
      </header>
      <MainContent />
    </LanguageProvider>
  );
}

// LanguageSwitcher.js
import React from "react";
import { useLanguage } from "./LanguageContext";

function LanguageSwitcher() {
  const { currentLanguage, setLanguage } = useLanguage();

  const languages = [
    { code: "en-US", name: "English (US)" },
    { code: "en-GB", name: "English (UK)" },
    { code: "es-ES", name: "Español" },
    { code: "fr-FR", name: "Français" },
    { code: "de-DE", name: "Deutsch" },
  ];

  return (
    <div>
      <label htmlFor="language-select">Select language:</label>
      <select
        id="language-select"
        value={currentLanguage}
        onChange={(e) => setLanguage(e.target.value)}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
```

## Integration with React-Intl

If you're already using [react-intl](https://formatjs.io/docs/react-intl/) for internationalization, you can integrate ally-bcp-47 to validate language tags:

```jsx
import React, { useState, useEffect } from "react";
import { IntlProvider } from "react-intl";
import { isValid, canonicalizeTag, parseTag } from "ally-bcp-47";

// Import your translations
import enMessages from "./translations/en.json";
import esMessages from "./translations/es.json";
import frMessages from "./translations/fr.json";

const messages = {
  en: enMessages,
  es: esMessages,
  fr: frMessages,
};

function App() {
  const [locale, setLocale] = useState(() => {
    const browserLang = navigator.language || navigator.userLanguage;
    if (isValid(browserLang)) {
      const { language } = parseTag(browserLang);
      // Use just the language part for messages lookup
      return language;
    }
    return "en";
  });

  const handleLocaleChange = (newLocale) => {
    if (!isValid(newLocale)) {
      console.error(`Invalid language tag: ${newLocale}`);
      return;
    }

    const canonicalLocale = canonicalizeTag(newLocale);
    const { language } = parseTag(canonicalLocale);
    setLocale(language);

    // Set full canonical tag on html element
    document.documentElement.lang = canonicalLocale;
  };

  useEffect(() => {
    // Ensure the HTML lang attribute is set on initial load
    if (isValid(locale)) {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return (
    <IntlProvider
      locale={locale}
      messages={messages[locale] || messages.en}
      defaultLocale="en"
    >
      <div className="app">
        {/* Your app components */}
        <select
          value={locale}
          onChange={(e) => handleLocaleChange(e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
      </div>
    </IntlProvider>
  );
}
```

## Creating an Accessible Language Switcher Component

Here's a more comprehensive, accessible language switcher component:

```jsx
import React, { useState } from "react";
import { useLanguage } from "./LanguageContext";
import { isValid, canonicalizeTag } from "ally-bcp-47";

function AccessibleLanguageSwitcher() {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [customTag, setCustomTag] = useState("");
  const [customTagError, setCustomTagError] = useState("");

  const languageOptions = [
    { code: "en-US", name: "English (US)", flag: "🇺🇸" },
    { code: "en-GB", name: "English (UK)", flag: "🇬🇧" },
    { code: "es-ES", name: "Español", flag: "🇪🇸" },
    { code: "fr-FR", name: "Français", flag: "🇫🇷" },
    { code: "de-DE", name: "Deutsch", flag: "🇩🇪" },
    { code: "ja-JP", name: "日本語", flag: "🇯🇵" },
    { code: "zh-Hans-CN", name: "简体中文", flag: "🇨🇳" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLanguageSelect = (code) => {
    setLanguage(code);
    setIsMenuOpen(false);
  };

  const handleCustomTagSubmit = (e) => {
    e.preventDefault();

    if (!customTag) {
      setCustomTagError("Please enter a language tag");
      return;
    }

    if (!isValid(customTag)) {
      setCustomTagError(`Invalid language tag: ${customTag}`);
      return;
    }

    setLanguage(canonicalizeTag(customTag));
    setCustomTag("");
    setCustomTagError("");
    setIsMenuOpen(false);
  };

  // Find current language display info
  const currentOption = languageOptions.find(
    (option) => option.code === currentLanguage
  ) || { code: currentLanguage, name: currentLanguage, flag: "🌐" };

  return (
    <div className="language-switcher">
      <button
        aria-expanded={isMenuOpen}
        aria-controls="language-menu"
        onClick={toggleMenu}
        className="language-button"
      >
        <span aria-hidden="true">{currentOption.flag}</span>
        <span>{currentOption.name}</span>
      </button>

      {isMenuOpen && (
        <div id="language-menu" role="menu" className="language-menu">
          <ul>
            {languageOptions.map((option) => (
              <li key={option.code} role="none">
                <button
                  role="menuitem"
                  onClick={() => handleLanguageSelect(option.code)}
                  aria-current={
                    currentLanguage === option.code ? "true" : undefined
                  }
                >
                  <span aria-hidden="true">{option.flag}</span>
                  <span lang={option.code}>{option.name}</span>
                </button>
              </li>
            ))}
          </ul>

          <form
            onSubmit={handleCustomTagSubmit}
            className="custom-language-form"
          >
            <label htmlFor="custom-language-input">Custom Language Tag:</label>
            <div className="input-group">
              <input
                id="custom-language-input"
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="e.g., fr-CA"
                aria-invalid={!!customTagError}
                aria-describedby={
                  customTagError ? "custom-language-error" : undefined
                }
              />
              <button type="submit">Apply</button>
            </div>
            {customTagError && (
              <p id="custom-language-error" className="error">
                {customTagError}
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

export default AccessibleLanguageSwitcher;
```

## Testing Language Tag Validation in React

Here's how to test your language tag validation with React Testing Library:

```jsx
// LanguageSelector.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LanguageSelector from "./LanguageSelector";

describe("LanguageSelector", () => {
  test("validates correct language tags", () => {
    render(<LanguageSelector />);

    const input = screen.getByLabelText(/Language Tag/i);

    // Test valid tag
    fireEvent.change(input, { target: { value: "en-US" } });
    expect(screen.queryByText(/Invalid language tag/i)).not.toBeInTheDocument();

    // Test another valid tag
    fireEvent.change(input, { target: { value: "fr-CA" } });
    expect(screen.queryByText(/Invalid language tag/i)).not.toBeInTheDocument();
  });

  test("shows error for invalid language tags", () => {
    render(<LanguageSelector />);

    const input = screen.getByLabelText(/Language Tag/i);

    // Test with underscore (invalid)
    fireEvent.change(input, { target: { value: "en_US" } });
    expect(screen.getByText(/Invalid language tag/i)).toBeInTheDocument();

    // Test with full language name (invalid)
    fireEvent.change(input, { target: { value: "english" } });
    expect(screen.getByText(/Invalid language tag/i)).toBeInTheDocument();
  });
});
```

## Conclusion

Integrating ally-bcp-47 into your React applications helps ensure proper language tag handling for internationalization and accessibility. By using the patterns shown in this guide, you can:

1. Validate user input for language tags
2. Store and manage language preferences
3. Apply canonical language tags to the HTML document
4. Create accessible language switching interfaces
5. Test your language implementations

Remember that proper language identification is crucial for accessibility and internationalization, and ally-bcp-47 provides the tools you need to implement it correctly in your React applications.
