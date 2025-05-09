# Vue Implementation Guide

This guide demonstrates how to effectively integrate ally-bcp-47 into your Vue applications for proper language tag validation and management.

## Installation

First, install the ally-bcp-47 package:

```bash
npm install ally-bcp-47
# or
yarn add ally-bcp-47
```

## Basic Usage in Vue 3

Here's a simple example of validating a language tag in a Vue 3 component using the Composition API:

```vue
<template>
  <div>
    <label for="language-input">Language Tag:</label>
    <input
      id="language-input"
      v-model="languageTag"
      :aria-invalid="!!error"
      :aria-describedby="error ? 'language-error' : undefined"
    />
    <p v-if="error" id="language-error" class="error">{{ error }}</p>
    <p v-if="isValid" class="success">Valid language tag!</p>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { isValid, canonicalizeTag } from "ally-bcp-47";

const languageTag = ref("en-US");
const error = ref("");
const isValid = ref(true);

watch(languageTag, (value) => {
  if (!isValid(value)) {
    error.value = `Invalid language tag: ${value}`;
    isValid.value = false;
  } else {
    error.value = "";
    isValid.value = true;

    // You might want to set the canonical form
    const canonicalTag = canonicalizeTag(value);
    // Do something with the canonical tag
  }
});
</script>

<style scoped>
.error {
  color: red;
}
.success {
  color: green;
}
</style>
```

## Vue 2 Example with Options API

If you're using Vue 2 with the Options API:

```vue
<template>
  <div>
    <label for="language-input">Language Tag:</label>
    <input
      id="language-input"
      v-model="languageTag"
      :aria-invalid="!!error"
      :aria-describedby="error ? 'language-error' : undefined"
    />
    <p v-if="error" id="language-error" class="error">{{ error }}</p>
    <p v-if="isValidTag" class="success">Valid language tag!</p>
  </div>
</template>

<script>
import { isValid, canonicalizeTag } from "ally-bcp-47";

export default {
  name: "LanguageTagInput",
  data() {
    return {
      languageTag: "en-US",
      error: "",
      isValidTag: true,
    };
  },
  watch: {
    languageTag(value) {
      if (!isValid(value)) {
        this.error = `Invalid language tag: ${value}`;
        this.isValidTag = false;
      } else {
        this.error = "";
        this.isValidTag = true;

        // You might want to set the canonical form
        const canonicalTag = canonicalizeTag(value);
        // Do something with the canonical tag
      }
    },
  },
};
</script>

<style scoped>
.error {
  color: red;
}
.success {
  color: green;
}
</style>
```

## Creating a Composable for Vue 3

For better reusability in Vue 3, create a composable function:

```js
// useBCP47Validation.js
import { ref, computed, watch } from "vue";
import { isValid, isWellFormed, canonicalizeTag, parseTag } from "ally-bcp-47";

export function useBCP47Validation(initialTag = "") {
  const tag = ref(initialTag);
  const isValidTag = ref(false);
  const isWellFormedTag = ref(false);
  const canonicalForm = ref("");
  const parsedTag = ref(null);
  const error = ref("");

  // Validate the tag whenever it changes
  const validateTag = () => {
    // Check validity
    isValidTag.value = isValid(tag.value);

    // Check well-formedness
    isWellFormedTag.value = isWellFormed(tag.value);

    // Get canonical form if well-formed
    if (isWellFormedTag.value) {
      try {
        canonicalForm.value = canonicalizeTag(tag.value);
      } catch (e) {
        canonicalForm.value = "";
      }
    } else {
      canonicalForm.value = "";
    }

    // Parse tag if well-formed
    if (isWellFormedTag.value) {
      try {
        parsedTag.value = parseTag(tag.value);
      } catch (e) {
        parsedTag.value = null;
      }
    } else {
      parsedTag.value = null;
    }

    // Set error message
    if (!isWellFormedTag.value) {
      error.value = "The language tag is not well-formed.";
    } else if (!isValidTag.value) {
      error.value = "The language tag is well-formed but not valid.";
    } else {
      error.value = "";
    }
  };

  // Initial validation
  validateTag();

  // Watch for changes
  watch(tag, validateTag);

  return {
    tag,
    isValidTag,
    isWellFormedTag,
    canonicalForm,
    parsedTag,
    error,
    setTag: (newTag) => {
      tag.value = newTag;
    },
  };
}
```

Then use it in your components:

```vue
<template>
  <div>
    <label for="lang-input">Language Tag:</label>
    <input
      id="lang-input"
      v-model="tag"
      :aria-invalid="!!error"
      :aria-describedby="error ? 'lang-status' : undefined"
    />

    <div id="lang-status">
      <p v-if="error" class="error">{{ error }}</p>
      <p v-else class="success">Valid language tag!</p>
    </div>

    <div v-if="isWellFormedTag">
      <p>Canonical form: {{ canonicalForm }}</p>
      <div v-if="parsedTag">
        <dl>
          <dt>Language:</dt>
          <dd>{{ parsedTag.language }}</dd>

          <template v-if="parsedTag.script">
            <dt>Script:</dt>
            <dd>{{ parsedTag.script }}</dd>
          </template>

          <template v-if="parsedTag.region">
            <dt>Region:</dt>
            <dd>{{ parsedTag.region }}</dd>
          </template>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBCP47Validation } from "./useBCP47Validation";

const { tag, isValidTag, isWellFormedTag, canonicalForm, parsedTag, error } =
  useBCP47Validation("en-US");
</script>
```

## Integrating with Vue I18n

If you're using [Vue I18n](https://vue-i18n.intlify.dev/) for internationalization, you can integrate ally-bcp-47 to ensure proper language tag handling:

### Vue 3 with Vue I18n v9

```js
// i18n.js
import { createI18n } from "vue-i18n";
import { isValid, canonicalizeTag, parseTag } from "ally-bcp-47";

// Import your translations
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";

const messages = {
  en,
  fr,
  es,
};

// Get the user's preferred language
function getPreferredLanguage() {
  // Check localStorage first
  const storedLang = localStorage.getItem("language");
  if (storedLang && isValid(storedLang)) {
    return canonicalizeTag(storedLang);
  }

  // Use browser language as fallback
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang && isValid(browserLang)) {
    const { language } = parseTag(browserLang);
    return language; // Just use the primary language subtag
  }

  // Default to English
  return "en";
}

const i18n = createI18n({
  locale: getPreferredLanguage(),
  fallbackLocale: "en",
  messages,
  legacy: false, // Use Composition API mode
});

// Update HTML lang attribute
const setDocumentLang = (locale) => {
  if (isValid(locale)) {
    document.documentElement.lang = canonicalizeTag(locale);
  } else {
    // If locale is just a language code without region (e.g., 'en')
    document.documentElement.lang = locale;
  }
};

// Initial setup
setDocumentLang(i18n.global.locale.value);

// Export a function to change the language
export function setLanguage(lang) {
  if (!isValid(lang)) {
    console.error(`Invalid language tag: ${lang}`);
    return false;
  }

  const canonicalLang = canonicalizeTag(lang);
  const { language } = parseTag(canonicalLang);

  // Check if we have translations for this language
  if (!messages[language]) {
    console.warn(`No translations available for ${language}`);
  }

  // Set the locale to the language part (for messages lookup)
  i18n.global.locale.value = language;

  // Store user preference
  localStorage.setItem("language", canonicalLang);

  // Update HTML lang attribute with full canonical tag
  setDocumentLang(canonicalLang);

  return true;
}

export default i18n;
```

Usage in your Vue 3 app:

```vue
<template>
  <div>
    <div class="language-switcher">
      <label for="language-select">{{ $t("language.select") }}</label>
      <select id="language-select" v-model="selectedLanguage">
        <option value="en-US">English (US)</option>
        <option value="en-GB">English (UK)</option>
        <option value="fr-FR">Français</option>
        <option value="es-ES">Español</option>
      </select>
    </div>

    <h1>{{ $t("welcomeTitle") }}</h1>
    <p>{{ $t("welcomeMessage") }}</p>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { setLanguage } from "./i18n";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const selectedLanguage = ref(document.documentElement.lang || "en-US");

watch(selectedLanguage, (newLang) => {
  setLanguage(newLang);
});
</script>
```

### Vue 2 with Vue I18n v8

```js
// i18n.js
import Vue from "vue";
import VueI18n from "vue-i18n";
import { isValid, canonicalizeTag, parseTag } from "ally-bcp-47";

Vue.use(VueI18n);

// Import your translations
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";

const messages = {
  en,
  fr,
  es,
};

// Get the user's preferred language
function getPreferredLanguage() {
  // Check localStorage first
  const storedLang = localStorage.getItem("language");
  if (storedLang && isValid(storedLang)) {
    const { language } = parseTag(canonicalizeTag(storedLang));
    return language;
  }

  // Use browser language as fallback
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang && isValid(browserLang)) {
    const { language } = parseTag(browserLang);
    return language;
  }

  // Default to English
  return "en";
}

const i18n = new VueI18n({
  locale: getPreferredLanguage(),
  fallbackLocale: "en",
  messages,
});

// Update HTML lang attribute
const setDocumentLang = (locale) => {
  if (isValid(locale)) {
    document.documentElement.lang = canonicalizeTag(locale);
  } else {
    document.documentElement.lang = locale;
  }
};

// Set initial document language
setDocumentLang(i18n.locale);

// Add a method to change the language
Vue.prototype.$setLanguage = function (lang) {
  if (!isValid(lang)) {
    console.error(`Invalid language tag: ${lang}`);
    return false;
  }

  const canonicalLang = canonicalizeTag(lang);
  const { language } = parseTag(canonicalLang);

  // Check if we have translations for this language
  if (!messages[language]) {
    console.warn(`No translations available for ${language}`);
  }

  // Set the locale to the language part (for messages lookup)
  i18n.locale = language;

  // Store user preference
  localStorage.setItem("language", canonicalLang);

  // Update HTML lang attribute with full canonical tag
  setDocumentLang(canonicalLang);

  return true;
};

export default i18n;
```

## Creating an Accessible Language Switcher Component for Vue 3

Here's a comprehensive language switcher component for Vue 3:

```vue
<template>
  <div class="language-switcher">
    <button
      :aria-expanded="isMenuOpen"
      aria-controls="language-menu"
      @click="toggleMenu"
      class="language-button"
    >
      <span aria-hidden="true">{{ currentOption.flag }}</span>
      <span>{{ currentOption.name }}</span>
    </button>

    <div v-if="isMenuOpen" id="language-menu" role="menu" class="language-menu">
      <ul>
        <li v-for="option in languageOptions" :key="option.code" role="none">
          <button
            role="menuitem"
            @click="selectLanguage(option.code)"
            :aria-current="currentLanguage === option.code ? 'true' : undefined"
          >
            <span aria-hidden="true">{{ option.flag }}</span>
            <span :lang="option.code">{{ option.name }}</span>
          </button>
        </li>
      </ul>

      <form @submit.prevent="submitCustomTag" class="custom-language-form">
        <label for="custom-language-input">Custom Language Tag:</label>
        <div class="input-group">
          <input
            id="custom-language-input"
            v-model="customTag"
            placeholder="e.g., fr-CA"
            :aria-invalid="!!customTagError"
            :aria-describedby="
              customTagError ? 'custom-language-error' : undefined
            "
          />
          <button type="submit">Apply</button>
        </div>
        <p v-if="customTagError" id="custom-language-error" class="error">
          {{ customTagError }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { isValid, canonicalizeTag } from "ally-bcp-47";

const props = defineProps({
  currentLanguage: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:language"]);

const isMenuOpen = ref(false);
const customTag = ref("");
const customTagError = ref("");

const languageOptions = [
  { code: "en-US", name: "English (US)", flag: "🇺🇸" },
  { code: "en-GB", name: "English (UK)", flag: "🇬🇧" },
  { code: "es-ES", name: "Español", flag: "🇪🇸" },
  { code: "fr-FR", name: "Français", flag: "🇫🇷" },
  { code: "de-DE", name: "Deutsch", flag: "🇩🇪" },
  { code: "ja-JP", name: "日本語", flag: "🇯🇵" },
  { code: "zh-Hans-CN", name: "简体中文", flag: "🇨🇳" },
];

const currentOption = computed(() => {
  return (
    languageOptions.find((option) => option.code === props.currentLanguage) || {
      code: props.currentLanguage,
      name: props.currentLanguage,
      flag: "🌐",
    }
  );
});

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const selectLanguage = (code) => {
  emit("update:language", code);
  isMenuOpen.value = false;
};

const submitCustomTag = () => {
  if (!customTag.value) {
    customTagError.value = "Please enter a language tag";
    return;
  }

  if (!isValid(customTag.value)) {
    customTagError.value = `Invalid language tag: ${customTag.value}`;
    return;
  }

  emit("update:language", canonicalizeTag(customTag.value));
  customTag.value = "";
  customTagError.value = "";
  isMenuOpen.value = false;
};

// Close menu when clicking outside
const handleClickOutside = (event) => {
  if (isMenuOpen.value && !event.target.closest(".language-switcher")) {
    isMenuOpen.value = false;
  }
};

// Add and remove event listener
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.language-switcher {
  position: relative;
}

.language-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid currentColor;
  border-radius: 4px;
  cursor: pointer;
}

.language-menu {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 100;
  min-width: 200px;
  margin-top: 0.25rem;
  padding: 0.5rem;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.language-menu ul {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
}

.language-menu button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem;
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
}

.language-menu button:hover,
.language-menu button:focus {
  background: #f5f5f5;
}

.language-menu button[aria-current="true"] {
  font-weight: bold;
  background: #f0f0f0;
}

.custom-language-form {
  padding-top: 0.5rem;
  border-top: 1px solid #eee;
}

.input-group {
  display: flex;
  margin-top: 0.25rem;
}

.input-group input {
  flex: 1;
}

.error {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
```

Usage in your app:

```vue
<template>
  <div>
    <LanguageSwitcher
      :current-language="currentLanguage"
      @update:language="updateLanguage"
    />

    <h1>{{ $t("title") }}</h1>
    <!-- Rest of your app -->
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import LanguageSwitcher from "./LanguageSwitcher.vue";
import { setLanguage } from "./i18n";

const { t } = useI18n();
const currentLanguage = ref(document.documentElement.lang || "en-US");

const updateLanguage = (newLang) => {
  if (setLanguage(newLang)) {
    currentLanguage.value = newLang;
  }
};
</script>
```

## Creating a Global Plugin for Vue 3

You can create a plugin to provide ally-bcp-47 functionality throughout your Vue 3 application:

```js
// plugins/bcp47.js
import { isValid, isWellFormed, canonicalizeTag, parseTag } from "ally-bcp-47";

export default {
  install: (app, options = {}) => {
    // Add global properties
    app.config.globalProperties.$bcp47 = {
      isValid,
      isWellFormed,
      canonicalizeTag,
      parseTag,

      // Set the document language
      setDocumentLang(tag) {
        if (!isValid(tag)) {
          console.error(`Invalid language tag: ${tag}`);
          return false;
        }

        const canonicalTag = canonicalizeTag(tag);
        document.documentElement.lang = canonicalTag;

        // Store preference if enabled in options
        if (options.storePreference) {
          localStorage.setItem("preferred-language", canonicalTag);
        }

        return true;
      },

      // Get user's preferred language
      getPreferredLang() {
        // Check localStorage first
        const savedLang = localStorage.getItem("preferred-language");
        if (savedLang && isValid(savedLang)) {
          return canonicalizeTag(savedLang);
        }

        // Try to use browser language
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang && isValid(browserLang)) {
          return canonicalizeTag(browserLang);
        }

        // Fallback to default
        return options.defaultLang || "en";
      },
    };

    // Provide for Composition API
    app.provide("bcp47", app.config.globalProperties.$bcp47);
  },
};
```

Then register the plugin in your application:

```js
// main.js
import { createApp } from "vue";
import App from "./App.vue";
import BCP47Plugin from "./plugins/bcp47";

const app = createApp(App);

app.use(BCP47Plugin, {
  defaultLang: "en-US",
  storePreference: true,
});

app.mount("#app");
```

Usage in a component with Composition API:

```vue
<script setup>
import { inject, onMounted } from "vue";

// Access through injection
const bcp47 = inject("bcp47");

onMounted(() => {
  // Set initial language
  const userLang = bcp47.getPreferredLang();
  bcp47.setDocumentLang(userLang);
});
</script>
```

Or with Options API:

```vue
<script>
export default {
  mounted() {
    // Access through global properties
    const userLang = this.$bcp47.getPreferredLang();
    this.$bcp47.setDocumentLang(userLang);
  },
  methods: {
    validateTag(tag) {
      return this.$bcp47.isValid(tag);
    },
  },
};
</script>
```

## Testing Language Tag Validation in Vue

Here's how to test your language tag validation with Vue Test Utils:

```js
// LanguageSelector.spec.js
import { mount } from "@vue/test-utils";
import LanguageSelector from "../LanguageSelector.vue";

describe("LanguageSelector", () => {
  test("validates correct language tags", async () => {
    const wrapper = mount(LanguageSelector);
    const input = wrapper.find("#language-input");

    // Test valid tag
    await input.setValue("en-US");
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".error").exists()).toBe(false);

    // Test another valid tag
    await input.setValue("fr-CA");
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".error").exists()).toBe(false);
  });

  test("shows error for invalid language tags", async () => {
    const wrapper = mount(LanguageSelector);
    const input = wrapper.find("#language-input");

    // Test with underscore (invalid)
    await input.setValue("en_US");
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".error").exists()).toBe(true);
    expect(wrapper.find(".error").text()).toContain("Invalid language tag");

    // Test with full language name (invalid)
    await input.setValue("english");
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".error").exists()).toBe(true);
    expect(wrapper.find(".error").text()).toContain("Invalid language tag");
  });
});
```

## Conclusion

Integrating ally-bcp-47 into your Vue applications helps ensure proper language tag handling for internationalization and accessibility. By using the patterns shown in this guide, you can:

1. Validate language tags in Vue components
2. Create reusable composables for validation
3. Integrate with Vue I18n for proper internationalization
4. Create accessible language switcher components
5. Provide global access to language validation functions

Remember that proper language identification is crucial for accessibility and internationalization, and ally-bcp-47 provides the tools you need to implement it correctly in your Vue applications.
