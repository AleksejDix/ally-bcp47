<template>
  <div class="validator">
    <div class="input-group">
      <input
        v-model="languageTag"
        type="text"
        placeholder="Enter a BCP-47 language tag (e.g., en-US, fr-CA, zh-Hans-CN)"
        @keyup.enter="validateTag"
      />
      <button @click="validateTag" :disabled="!languageTag">Validate</button>
    </div>

    <div
      v-if="result"
      class="result"
      :class="{ valid: result.isValid, invalid: !result.isValid }"
    >
      <div class="result-header">
        <div
          class="status-badge"
          :class="{ valid: result.isValid, invalid: !result.isValid }"
        >
          {{ result.isValid ? "Valid" : "Invalid" }}
        </div>
        <div v-if="result.tag" class="canonical-tag">
          Canonical form: <code>{{ result.tag.tag }}</code>
        </div>
      </div>

      <div v-if="result.tag" class="tag-breakdown">
        <h3>Tag Components</h3>
        <table>
          <tr v-if="result.tag.language">
            <td>Language</td>
            <td>
              <code>{{ result.tag.language }}</code>
            </td>
          </tr>
          <tr v-if="result.tag.script">
            <td>Script</td>
            <td>
              <code>{{ result.tag.script }}</code>
            </td>
          </tr>
          <tr v-if="result.tag.region">
            <td>Region</td>
            <td>
              <code>{{ result.tag.region }}</code>
            </td>
          </tr>
          <tr v-if="result.tag.variants && result.tag.variants.length">
            <td>Variants</td>
            <td>
              <code>{{ result.tag.variants.join(", ") }}</code>
            </td>
          </tr>
          <tr v-if="result.tag.extensions">
            <td>Extensions</td>
            <td>
              <div
                v-for="(values, singleton) in result.tag.extensions"
                :key="singleton"
              >
                <code>{{ singleton }}: {{ values.join(", ") }}</code>
              </div>
            </td>
          </tr>
          <tr v-if="result.tag.privateuse && result.tag.privateuse.length">
            <td>Private Use</td>
            <td>
              <code>{{ result.tag.privateuse.join(", ") }}</code>
            </td>
          </tr>
        </table>
      </div>

      <div v-if="result.errors && result.errors.length" class="errors">
        <h3>Errors</h3>
        <ul>
          <li v-for="(error, index) in result.errors" :key="index">
            {{ error.message }}
            <span v-if="error.suggestedReplacement" class="suggestion">
              Suggestion: <code>{{ error.suggestedReplacement }}</code>
            </span>
          </li>
        </ul>
      </div>

      <div v-if="result.warnings && result.warnings.length" class="warnings">
        <h3>Warnings</h3>
        <ul>
          <li v-for="(warning, index) in result.warnings" :key="index">
            {{ warning.message }}
            <span v-if="warning.suggestedReplacement" class="suggestion">
              Suggestion: <code>{{ warning.suggestedReplacement }}</code>
            </span>
          </li>
        </ul>
      </div>
    </div>

    <div class="examples">
      <h3>Examples to try:</h3>
      <div class="example-buttons">
        <button @click="setExample('en-US')">en-US</button>
        <button @click="setExample('fr-CA')">fr-CA</button>
        <button @click="setExample('zh-Hans-CN')">zh-Hans-CN</button>
        <button @click="setExample('en-US-u-ca-gregory')">
          en-US-u-ca-gregory
        </button>
        <button @click="setExample('gsw-CH')">gsw-CH</button>
        <button @click="setExample('sr-Cyrl-RS')">sr-Cyrl-RS</button>
        <button @click="setExample('de-DE-1901')">de-DE-1901</button>
        <button @click="setExample('en-UK')">en-UK</button>
        <button @click="setExample('ch-DE')">ch-DE</button>
        <button @click="setExample('en--US')">en--US</button>
        <button @click="setExample('xx-YY')">xx-YY</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
// Import the actual library function
import { validateLanguageTag } from "../../../dist/index.js";

const languageTag = ref("");
const result = ref(null);

function validateTag() {
  if (!languageTag.value) return;
  result.value = validateLanguageTag(languageTag.value);
}

function setExample(example) {
  languageTag.value = example;
  validateTag();
}
</script>

<style scoped>
.validator {
  max-width: 100%;
}

.input-group {
  display: flex;
  margin-bottom: 1.5rem;
}

input {
  flex: 1;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px 0 0 4px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: var(--vp-c-brand-dark);
}

button:disabled {
  background-color: var(--vp-c-gray);
  cursor: not-allowed;
}

.result {
  margin-top: 1rem;
  padding: 1.5rem;
  border-radius: 4px;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-weight: bold;
}

.valid {
  border-color: var(--vp-c-green);
  background-color: rgba(0, 200, 0, 0.1);
}

.status-badge.valid {
  background-color: var(--vp-c-green);
  color: white;
}

.invalid {
  border-color: var(--vp-c-red);
  background-color: rgba(200, 0, 0, 0.1);
}

.status-badge.invalid {
  background-color: var(--vp-c-red);
  color: white;
}

.canonical-tag {
  font-size: 1.1rem;
}

code {
  background-color: var(--vp-c-bg-mute);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
}

.tag-breakdown {
  margin: 1.5rem 0;
}

table {
  width: 100%;
  border-collapse: collapse;
}

td {
  padding: 0.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

td:first-child {
  font-weight: bold;
  width: 30%;
}

.errors {
  margin-top: 1rem;
  color: var(--vp-c-red);
}

.warnings {
  margin-top: 1rem;
  color: var(--vp-c-yellow);
}

.suggestion {
  font-style: italic;
  margin-left: 0.5rem;
}

.examples {
  margin-top: 2rem;
}

.example-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.example-buttons button {
  border-radius: 4px;
  background-color: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
}

.example-buttons button:hover {
  background-color: var(--vp-c-gray-light-3);
}
</style>
