<template>
  <div class="interactive-tag-builder">
    <h2>Interactive Tag Builder</h2>

    <div class="tag-builder-container">
      <div class="tag-preview">
        <div
          v-for="(part, index) in availableParts"
          :key="part.id"
          class="tag-preview-part"
          :class="{ active: tagParts[part.id], inactive: !tagParts[part.id] }"
          @click="togglePartForm(part.id)"
        >
          <div class="preview-content" v-if="tagParts[part.id]">
            <div class="preview-label">{{ part.name }}</div>
            <div class="preview-value">{{ tagParts[part.id] }}</div>
          </div>
          <div class="preview-content" v-else>
            <div class="preview-label">{{ part.name }}</div>
            <div class="preview-add">+ Add {{ part.name }}</div>
          </div>
          <div class="preview-hyphen" v-if="showHyphen(index)">-</div>
        </div>
      </div>

      <div class="tag-result">
        <div class="tag-string">
          <code>{{ constructedTag }}</code>
        </div>
        <button class="validate-button" @click="validateTag">Validate</button>
      </div>

      <div class="part-forms">
        <div v-if="activePartForm" class="part-form">
          <h3>{{ getActivePartData.name }}</h3>
          <p class="part-description">{{ getActivePartData.description }}</p>

          <div class="form-group">
            <label :for="activePartForm"
              >{{ getActivePartData.name }} Value:</label
            >
            <div class="input-with-examples">
              <input
                :id="activePartForm"
                v-model="tagParts[activePartForm]"
                :placeholder="getActivePartData.placeholder"
                type="text"
              />

              <div
                v-if="getActivePartData.common?.length"
                class="common-examples"
              >
                <div class="common-label">Common values:</div>
                <div class="common-buttons">
                  <button
                    v-for="example in getActivePartData.common"
                    :key="example.value"
                    class="common-button"
                    @click="tagParts[activePartForm] = example.value"
                  >
                    {{ example.value }}
                    <span class="common-tooltip">{{
                      example.description
                    }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button class="apply-button" @click="applyPart">Apply</button>
            <button class="clear-button" @click="clearPart">Clear</button>
          </div>
        </div>

        <div v-else class="part-form-help">
          <p>Click on any part of the tag above to add or modify its value.</p>
          <p>Only the language part is required. All others are optional.</p>
        </div>
      </div>

      <div v-if="validationResult" class="validation-results">
        <div
          class="result-status"
          :class="{
            valid: validationResult.isValid,
            invalid: !validationResult.isValid,
          }"
        >
          {{ validationResult.isValid ? "Valid Tag" : "Invalid Tag" }}
        </div>

        <div v-if="validationResult.isValid" class="valid-message">
          <p>This is a valid BCP-47 language tag.</p>
          <div
            v-if="validationResult.tag?.tag !== constructedTag"
            class="canonical-form"
          >
            <p>
              Canonical form: <code>{{ validationResult.tag?.tag }}</code>
            </p>
          </div>
        </div>

        <div v-else class="error-list">
          <div class="error-header">Validation Errors:</div>
          <ul>
            <li v-for="(error, index) in validationResult.errors" :key="index">
              {{ error.message }}
              <span v-if="error.suggestedReplacement" class="suggestion">
                Suggestion: <code>{{ error.suggestedReplacement }}</code>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="preset-tags">
      <h3>Try Presets:</h3>
      <div class="preset-buttons">
        <button
          v-for="preset in presets"
          :key="preset.tag"
          class="preset-button"
          @click="loadPreset(preset)"
        >
          {{ preset.tag }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { validateLanguageTag } from "../../../dist/index.js";

const activePartForm = ref(null);
const validationResult = ref(null);

const tagParts = ref({
  language: "en",
  extlang: "",
  script: "",
  region: "",
  variant: "",
  extension: "",
  privateuse: "",
});

const availableParts = [
  {
    id: "language",
    name: "Language",
    description:
      "The primary language subtag (required). Based on ISO 639 codes.",
    placeholder: "e.g., en, fr, de",
    common: [
      { value: "en", description: "English" },
      { value: "fr", description: "French" },
      { value: "de", description: "German" },
      { value: "es", description: "Spanish" },
      { value: "zh", description: "Chinese" },
      { value: "ja", description: "Japanese" },
      { value: "ru", description: "Russian" },
    ],
  },
  {
    id: "extlang",
    name: "Extended Language",
    description:
      "Extended language subtags for more specific variants. Rarely used.",
    placeholder: "e.g., cmn (for Mandarin)",
    common: [
      { value: "cmn", description: "Mandarin Chinese" },
      { value: "yue", description: "Cantonese Chinese" },
      { value: "afb", description: "Gulf Arabic" },
    ],
  },
  {
    id: "script",
    name: "Script",
    description: "The writing system used. Based on ISO 15924 codes.",
    placeholder: "e.g., Latn, Cyrl, Hans",
    common: [
      { value: "Latn", description: "Latin script" },
      { value: "Cyrl", description: "Cyrillic script" },
      { value: "Hans", description: "Simplified Han script" },
      { value: "Hant", description: "Traditional Han script" },
      { value: "Arab", description: "Arabic script" },
      { value: "Jpan", description: "Japanese script" },
    ],
  },
  {
    id: "region",
    name: "Region",
    description:
      "The geographical region where the language is used. Based on ISO 3166-1 or UN M.49.",
    placeholder: "e.g., US, GB, DE",
    common: [
      { value: "US", description: "United States" },
      { value: "GB", description: "United Kingdom" },
      { value: "CA", description: "Canada" },
      { value: "DE", description: "Germany" },
      { value: "FR", description: "France" },
      { value: "JP", description: "Japan" },
      { value: "CN", description: "China" },
    ],
  },
  {
    id: "variant",
    name: "Variant",
    description:
      "Specific variations of a language, like dialects or orthographies.",
    placeholder: "e.g., 1901, rozaj, valencia",
    common: [
      { value: "1901", description: "Traditional German orthography" },
      { value: "rozaj", description: "Resian dialect of Slovenian" },
      { value: "valencia", description: "Valencian variant of Catalan" },
    ],
  },
  {
    id: "extension",
    name: "Extension",
    description:
      "Extensions for additional information. Format: singleton-value(s).",
    placeholder: "e.g., u-ca-gregory",
    common: [
      { value: "u-ca-gregory", description: "Gregorian calendar" },
      { value: "u-nu-latn", description: "Latin numerals" },
      { value: "u-co-phonebk", description: "Phonebook sort order" },
    ],
  },
  {
    id: "privateuse",
    name: "Private Use",
    description:
      'For private agreements between parties. Must start with "x-".',
    placeholder: "e.g., x-private",
    common: [
      { value: "x-private", description: "Generic private use" },
      { value: "x-company", description: "Company-specific usage" },
      { value: "x-custom", description: "Custom usage" },
    ],
  },
];

const presets = [
  { tag: "en-US", parts: { language: "en", region: "US" } },
  { tag: "fr-CA", parts: { language: "fr", region: "CA" } },
  {
    tag: "zh-Hans-CN",
    parts: { language: "zh", script: "Hans", region: "CN" },
  },
  {
    tag: "sr-Cyrl-RS",
    parts: { language: "sr", script: "Cyrl", region: "RS" },
  },
  {
    tag: "de-CH-1901",
    parts: { language: "de", region: "CH", variant: "1901" },
  },
  {
    tag: "en-US-u-ca-gregory",
    parts: { language: "en", region: "US", extension: "u-ca-gregory" },
  },
  {
    tag: "ja-JP-x-custom",
    parts: { language: "ja", region: "JP", privateuse: "x-custom" },
  },
];

const constructedTag = computed(() => {
  let result = "";
  if (tagParts.value.language) {
    result += tagParts.value.language;
  }
  if (tagParts.value.extlang) {
    result += `-${tagParts.value.extlang}`;
  }
  if (tagParts.value.script) {
    result += `-${tagParts.value.script}`;
  }
  if (tagParts.value.region) {
    result += `-${tagParts.value.region}`;
  }
  if (tagParts.value.variant) {
    result += `-${tagParts.value.variant}`;
  }
  if (tagParts.value.extension) {
    result += `-${tagParts.value.extension}`;
  }
  if (tagParts.value.privateuse) {
    result += `-${tagParts.value.privateuse}`;
  }
  return result;
});

const getActivePartData = computed(() => {
  return availableParts.find((part) => part.id === activePartForm.value) || {};
});

function showHyphen(index) {
  // Show hyphen if this isn't the last part and there's a next active part
  if (index === availableParts.length - 1) return false;

  const currentPartId = availableParts[index].id;
  if (!tagParts.value[currentPartId]) return false;

  // Check if any later parts are active
  for (let i = index + 1; i < availableParts.length; i++) {
    if (tagParts.value[availableParts[i].id]) {
      return true;
    }
  }

  return false;
}

function togglePartForm(partId) {
  if (activePartForm.value === partId) {
    activePartForm.value = null;
  } else {
    activePartForm.value = partId;
  }
}

function applyPart() {
  // Just close the form, the model binding already updated the value
  activePartForm.value = null;
}

function clearPart() {
  if (activePartForm.value) {
    tagParts.value[activePartForm.value] = "";
    // Keep language as required
    if (activePartForm.value === "language") {
      tagParts.value.language = "en";
    }
    activePartForm.value = null;
  }
}

function validateTag() {
  if (!constructedTag.value) {
    validationResult.value = {
      isValid: false,
      isWellFormed: false,
      errors: [{ message: "Language tag cannot be empty" }],
    };
    return;
  }

  validationResult.value = validateLanguageTag(constructedTag.value);
}

function loadPreset(preset) {
  // Reset all parts
  Object.keys(tagParts.value).forEach((key) => {
    tagParts.value[key] = "";
  });

  // Apply preset values
  Object.keys(preset.parts).forEach((key) => {
    tagParts.value[key] = preset.parts[key];
  });

  // Close any open form
  activePartForm.value = null;

  // Clear validation
  validationResult.value = null;
}
</script>

<style scoped>
.interactive-tag-builder {
  max-width: 1000px;
  margin: 3rem auto;
  padding: 2rem;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tag-builder-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tag-preview {
  display: flex;
  flex-wrap: wrap;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: var(--vp-c-bg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

.tag-preview-part {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  margin: 0.25rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.tag-preview-part.active {
  background-color: var(--vp-c-brand-light);
  color: white;
}

.tag-preview-part.inactive {
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: 1px dashed var(--vp-c-divider);
}

.tag-preview-part:hover {
  transform: translateY(-2px);
}

.preview-content {
  display: flex;
  flex-direction: column;
}

.preview-label {
  font-size: 0.7rem;
  font-weight: bold;
  opacity: 0.8;
}

.preview-value {
  font-family: monospace;
  font-size: 1rem;
  margin-top: 0.25rem;
}

.preview-add {
  font-size: 0.8rem;
  margin-top: 0.25rem;
  color: var(--vp-c-text-2);
}

.preview-hyphen {
  font-size: 1.5rem;
  margin: 0 0.25rem;
  color: var(--vp-c-text-2);
}

.tag-result {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 6px;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
}

.tag-string {
  font-family: monospace;
  font-size: 1.1rem;
  padding: 0.5rem;
  background-color: var(--vp-c-bg-soft);
  border-radius: 4px;
  overflow-x: auto;
  max-width: 100%;
}

.validate-button {
  padding: 0.5rem 1rem;
  background-color: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.validate-button:hover {
  background-color: var(--vp-c-brand-dark);
}

.part-forms {
  min-height: 200px;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: var(--vp-c-bg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.part-form h3 {
  margin-top: 0;
  color: var(--vp-c-brand);
}

.part-description {
  margin-bottom: 1rem;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.input-with-examples {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-with-examples input {
  padding: 0.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  font-family: monospace;
}

.common-examples {
  margin-top: 0.5rem;
}

.common-label {
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
  color: var(--vp-c-text-2);
}

.common-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.common-button {
  position: relative;
  padding: 0.25rem 0.5rem;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.85rem;
  cursor: pointer;
}

.common-button:hover .common-tooltip {
  display: block;
}

.common-tooltip {
  display: none;
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 0.8rem;
  white-space: nowrap;
  z-index: 10;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
}

.apply-button,
.clear-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.apply-button {
  background-color: var(--vp-c-brand);
  color: white;
}

.apply-button:hover {
  background-color: var(--vp-c-brand-dark);
}

.clear-button {
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.clear-button:hover {
  background-color: var(--vp-c-bg-mute);
}

.validation-results {
  padding: 1.5rem;
  border-radius: 8px;
  background-color: var(--vp-c-bg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.result-status {
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  font-weight: bold;
  text-align: center;
}

.result-status.valid {
  background-color: rgba(0, 200, 0, 0.1);
  color: var(--vp-c-green);
  border: 1px solid var(--vp-c-green);
}

.result-status.invalid {
  background-color: rgba(200, 0, 0, 0.1);
  color: var(--vp-c-red);
  border: 1px solid var(--vp-c-red);
}

.canonical-form {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background-color: var(--vp-c-bg-soft);
  border-radius: 4px;
}

.error-header {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--vp-c-red);
}

.error-list ul {
  margin: 0;
  padding-left: 1.5rem;
  color: var(--vp-c-red);
}

.suggestion {
  display: block;
  margin-top: 0.25rem;
  font-style: italic;
}

.preset-tags {
  margin-top: 2rem;
}

.preset-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.preset-button {
  padding: 0.5rem 1rem;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  font-family: monospace;
  cursor: pointer;
  transition: all 0.2s;
}

.preset-button:hover {
  background-color: var(--vp-c-bg-mute);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .tag-preview {
    flex-direction: column;
    align-items: flex-start;
  }

  .tag-preview-part {
    width: 100%;
    margin: 0.25rem 0;
  }

  .preview-hyphen {
    display: none;
  }

  .common-buttons {
    flex-direction: column;
  }
}
</style>
