<template>
  <div class="tag-structure">
    <h2>BCP-47 Language Tag Structure</h2>
    <div class="tag-diagram">
      <div
        v-for="(part, index) in tagParts"
        :key="index"
        class="tag-part"
        :class="{ active: activePart === part.id }"
        @mouseenter="activePart = part.id"
        @mouseleave="activePart = null"
      >
        <div class="tag-part-content">
          <div class="tag-part-name">{{ part.name }}</div>
          <div class="tag-part-code">{{ part.code }}</div>
        </div>
        <div class="tag-part-hyphen" v-if="index < tagParts.length - 1">-</div>
      </div>
    </div>

    <div class="tag-explanation" v-if="activePart">
      <div class="tag-explanation-title">{{ getActivePart.name }}</div>
      <div class="tag-explanation-description">
        {{ getActivePart.description }}
      </div>
      <div class="tag-explanation-examples">
        <div class="example-title">Examples:</div>
        <div
          v-for="(example, i) in getActivePart.examples"
          :key="i"
          class="example-tag"
        >
          <code>{{ example.code }}</code>
          <span class="example-meaning">{{ example.meaning }}</span>
        </div>
      </div>
    </div>

    <div class="tag-default-explanation" v-else>
      <p>
        Hover over each part of the tag to learn more about its purpose and see
        examples.
      </p>
      <p>
        A BCP-47 language tag can include some or all of these components,
        separated by hyphens.
      </p>
      <p>
        Only the language subtag is required. The others are optional and used
        as needed.
      </p>
    </div>

    <div class="tag-examples">
      <h3>Complete Examples:</h3>
      <div
        class="complete-example"
        v-for="(example, index) in completeExamples"
        :key="index"
      >
        <div class="complete-tag">
          <code>{{ example.tag }}</code>
        </div>
        <div class="complete-meaning">{{ example.meaning }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const activePart = ref(null);

const tagParts = [
  {
    id: "language",
    name: "Language",
    code: "en",
    description:
      "Primary language subtag, based on ISO 639 codes. This is the only required part of the tag.",
    examples: [
      { code: "en", meaning: "English" },
      { code: "fr", meaning: "French" },
      { code: "de", meaning: "German" },
      { code: "zh", meaning: "Chinese" },
      { code: "ja", meaning: "Japanese" },
    ],
  },
  {
    id: "extlang",
    name: "Extended Language",
    code: "cmn",
    description:
      "Extended language subtags for more specific language variants. Usually 3 letters and not commonly used.",
    examples: [
      { code: "zh-cmn", meaning: "Mandarin Chinese" },
      { code: "zh-yue", meaning: "Cantonese Chinese" },
      { code: "ar-afb", meaning: "Gulf Arabic" },
    ],
  },
  {
    id: "script",
    name: "Script",
    code: "Latn",
    description:
      "Writing system used, based on ISO 15924 codes. Always 4 letters with first letter capitalized.",
    examples: [
      { code: "zh-Hans", meaning: "Chinese written in Simplified script" },
      { code: "zh-Hant", meaning: "Chinese written in Traditional script" },
      { code: "sr-Latn", meaning: "Serbian written in Latin script" },
      { code: "sr-Cyrl", meaning: "Serbian written in Cyrillic script" },
    ],
  },
  {
    id: "region",
    name: "Region",
    code: "US",
    description:
      "Geographical region where the language is used, based on ISO 3166-1 or UN M.49 codes.",
    examples: [
      { code: "en-US", meaning: "English as used in the United States" },
      { code: "en-GB", meaning: "English as used in the United Kingdom" },
      { code: "es-ES", meaning: "Spanish as used in Spain" },
      { code: "es-MX", meaning: "Spanish as used in Mexico" },
    ],
  },
  {
    id: "variant",
    name: "Variant",
    code: "1901",
    description:
      "Specific variations of a language, like dialects or orthographies.",
    examples: [
      {
        code: "de-DE-1901",
        meaning: "German, Germany, traditional orthography",
      },
      { code: "sl-rozaj", meaning: "Resian dialect of Slovenian" },
      { code: "ca-valencia", meaning: "Valencian variant of Catalan" },
    ],
  },
  {
    id: "extension",
    name: "Extension",
    code: "u-ca-gregory",
    description:
      'Extensions provide additional language or locale information. Each extension starts with a singleton (like "u" for Unicode).',
    examples: [
      {
        code: "en-US-u-ca-gregory",
        meaning: "English, United States, using Gregorian calendar",
      },
      {
        code: "ar-EG-u-nu-arab",
        meaning: "Arabic, Egypt, using Arabic numerals",
      },
      {
        code: "ja-JP-u-ca-japanese",
        meaning: "Japanese, Japan, using Japanese calendar",
      },
    ],
  },
  {
    id: "privateuse",
    name: "Private Use",
    code: "x-private",
    description:
      'Private use subtags for organization-specific or application-specific meanings. Always starts with "x-".',
    examples: [
      { code: "en-x-custom", meaning: "English with a private extension" },
      {
        code: "fr-FR-x-corp",
        meaning: "French as used in a corporate context",
      },
      {
        code: "de-CH-x-phonebk",
        meaning: "German (Switzerland) with phonebook sorting",
      },
    ],
  },
];

const completeExamples = [
  {
    tag: "en-US",
    meaning: "English as used in the United States",
  },
  {
    tag: "zh-Hans-CN",
    meaning: "Chinese written in Simplified script as used in China",
  },
  {
    tag: "sr-Latn-RS",
    meaning: "Serbian written in Latin script as used in Serbia",
  },
  {
    tag: "de-CH-1901-x-private",
    meaning:
      "German as used in Switzerland with traditional orthography and private extension",
  },
  {
    tag: "en-US-u-ca-gregory-nu-latn",
    meaning:
      "English as used in the United States with Gregorian calendar and Latin numerals",
  },
];

const getActivePart = computed(() => {
  return tagParts.find((part) => part.id === activePart.value);
});
</script>

<style scoped>
.tag-structure {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tag-diagram {
  display: flex;
  flex-wrap: wrap;
  margin: 2rem 0;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: var(--vp-c-bg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

.tag-part {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  margin: 0.25rem;
  border-radius: 6px;
  background-color: var(--vp-c-bg-soft);
  transition: all 0.2s ease;
  cursor: pointer;
  color: var(--vp-c-text-1);
}

.tag-part.active {
  background-color: var(--vp-c-brand);
  color: white;
  transform: translateY(-4px);
}

.tag-part-content {
  display: flex;
  flex-direction: column;
}

.tag-part-name {
  font-size: 0.85rem;
  font-weight: bold;
  opacity: 0.9;
}

.tag-part-code {
  font-family: monospace;
  font-size: 1.1rem;
  margin-top: 0.25rem;
}

.tag-part-hyphen {
  font-size: 1.5rem;
  margin: 0 0.5rem;
  color: var(--vp-c-text-2);
}

.tag-explanation,
.tag-default-explanation {
  min-height: 200px;
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: var(--vp-c-bg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.tag-explanation-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--vp-c-brand);
}

.tag-explanation-description {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.tag-explanation-examples {
  margin-top: 1rem;
}

.example-title {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.example-tag {
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
}

.example-tag code {
  font-family: monospace;
  background-color: var(--vp-c-bg-mute);
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  margin-right: 0.5rem;
}

.example-meaning {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.tag-examples {
  margin-top: 2rem;
}

.complete-example {
  display: flex;
  align-items: center;
  margin: 0.75rem 0;
  padding: 0.75rem;
  border-radius: 6px;
  background-color: var(--vp-c-bg);
}

.complete-tag {
  min-width: 250px;
}

.complete-tag code {
  font-family: monospace;
  background-color: var(--vp-c-bg-mute);
  padding: 0.3rem 0.5rem;
  border-radius: 3px;
}

@media (max-width: 768px) {
  .tag-diagram {
    flex-direction: column;
    align-items: flex-start;
  }

  .tag-part {
    margin: 0.25rem 0;
  }

  .tag-part-hyphen {
    display: none;
  }

  .complete-example {
    flex-direction: column;
    align-items: flex-start;
  }

  .complete-tag {
    margin-bottom: 0.5rem;
  }
}
</style>
