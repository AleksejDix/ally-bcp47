<template>
  <div class="language-search-builder">
    <div class="compact-container">
      <div class="lists-section">
        <div class="list-section">
          <h3>
            Language
            <span v-if="selectedRegion" class="filter-hint">
              ({{ displayedLanguages.length }} options for {{ selectedRegion.name }})
            </span>
          </h3>
          <div class="search-field">
            <input 
              v-model="languageSearchTerm" 
              type="text" 
              placeholder="Search languages..." 
              class="search-input"
            />
            <button v-if="languageSearchTerm" @click="languageSearchTerm = ''" class="clear-search">×</button>
          </div>
          <div class="list-container">
            <div 
              v-for="lang in displayedLanguages" 
              :key="lang.code" 
              class="list-item"
              @click="selectLanguage(lang)"
              :class="{ selected: selectedLanguage?.code === lang.code }"
            >
              <div class="item-code">{{ lang.code }}</div>
              <div class="item-name">{{ lang.name }}</div>
            </div>
            <div v-if="displayedLanguages.length === 0" class="empty-state">
              <span v-if="languageSearchTerm">No languages match "{{ languageSearchTerm }}"</span>
              <span v-else-if="selectedRegion">No languages available for {{ selectedRegion.name }}</span>
              <span v-else>Select a country to see available languages</span>
            </div>
          </div>
        </div>

        <div class="list-section">
          <h3>
            Country
            <span v-if="selectedLanguage" class="filter-hint">
              ({{ displayedCountries.length }} options for {{ selectedLanguage.name }})
            </span>
          </h3>
          <div class="search-field">
            <input 
              v-model="countrySearchTerm" 
              type="text" 
              placeholder="Search countries..." 
              class="search-input"
            />
            <button v-if="countrySearchTerm" @click="countrySearchTerm = ''" class="clear-search">×</button>
          </div>
          <div class="list-container">
            <div 
              v-for="region in displayedCountries" 
              :key="region.code" 
              class="list-item"
              @click="selectRegion(region)"
              :class="{ selected: selectedRegion?.code === region.code }"
            >
              <div class="item-code">{{ region.code }}</div>
              <div class="item-name">{{ region.name }}</div>
            </div>
            <div v-if="displayedCountries.length === 0" class="empty-state">
              <span v-if="countrySearchTerm">No countries match "{{ countrySearchTerm }}"</span>
              <span v-else-if="selectedLanguage">No countries available for {{ selectedLanguage.name }}</span>
              <span v-else>Select a language to see available countries</span>
            </div>
          </div>
        </div>
      </div>

      <div class="result-display">
        <div class="tag-with-actions">
          <div class="tag-input-group">
            <div class="tag-text" :class="{ valid: isTagValid, empty: !constructedTag }">
              {{ constructedTag || 'Select language and country' }}
            </div>
            <button 
              class="action-button copy-button" 
              @click="copyToClipboard" 
              :disabled="!constructedTag"
              :class="{ valid: isTagValid }"
            >
              <span class="icon">{{ isCopied ? '✓' : '⎘' }}</span>
              <span>{{ isCopied ? 'Copied' : 'Copy' }}</span>
            </button>
          </div>
          <div class="selections-row">
            <div class="selections" v-if="selectedLanguage">
              <span class="selection-label">{{ selectedLanguage.name }}</span>
              <span class="selection-separator" v-if="selectedRegion">+</span>
              <span class="selection-label" v-if="selectedRegion">{{ selectedRegion.name }}</span>
            </div>
            <button 
              v-if="selectedLanguage || selectedRegion"
              class="reset-button" 
              @click="resetSelections"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      
      <div class="support-section">
        <a href="https://buymeacoffee.com/allyship" target="_blank" class="coffee-button">
          <span class="coffee-icon">☕</span>
          <span>Buy me a coffee</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { validateLanguageTag } from "../../../dist/index.js";

// Language-country mappings
const countryLanguageMap = {
  'AT': ['de'], // Austria - German
  'BE': ['nl', 'fr', 'de'], // Belgium - Dutch, French, German
  'BG': ['bg'], // Bulgaria - Bulgarian
  'HR': ['hr'], // Croatia - Croatian
  'CY': ['el', 'tr'], // Cyprus - Greek, Turkish
  'CZ': ['cs'], // Czech Republic - Czech
  'DK': ['da'], // Denmark - Danish
  'EE': ['et'], // Estonia - Estonian
  'FI': ['fi', 'sv'], // Finland - Finnish, Swedish
  'FR': ['fr'], // France - French
  'DE': ['de'], // Germany - German
  'GR': ['el'], // Greece - Greek
  'HU': ['hu'], // Hungary - Hungarian
  'IE': ['en', 'ga'], // Ireland - English, Irish
  'IT': ['it'], // Italy - Italian
  'LV': ['lv'], // Latvia - Latvian
  'LT': ['lt'], // Lithuania - Lithuanian
  'LU': ['lb', 'fr', 'de'], // Luxembourg - Luxembourgish, French, German
  'MT': ['mt', 'en'], // Malta - Maltese, English
  'NL': ['nl'], // Netherlands - Dutch
  'PL': ['pl'], // Poland - Polish
  'PT': ['pt'], // Portugal - Portuguese
  'RO': ['ro'], // Romania - Romanian
  'SK': ['sk'], // Slovakia - Slovak
  'SI': ['sl'], // Slovenia - Slovenian
  'ES': ['es', 'ca', 'eu', 'gl'], // Spain - Spanish, Catalan, Basque, Galician
  'SE': ['sv'], // Sweden - Swedish
  'GB': ['en'], // UK - English
  'CH': ['de', 'fr', 'it'], // Switzerland - German, French, Italian
  'NO': ['no'], // Norway - Norwegian
};

// Generate the reverse mapping (language to countries)
const languageCountryMap = {};

// Fill the languageCountryMap from the countryLanguageMap
const buildLanguageCountryMap = () => {
  Object.entries(countryLanguageMap).forEach(([country, languages]) => {
    languages.forEach(lang => {
      if (!languageCountryMap[lang]) {
        languageCountryMap[lang] = [];
      }
      languageCountryMap[lang].push(country);
    });
  });
};

// Build the mapping on component mount
onMounted(() => {
  buildLanguageCountryMap();
});

// Common languages with ISO 639-1 codes
const commonLanguages = [
  { code: 'bg', name: 'Bulgarian' },
  { code: 'ca', name: 'Catalan' },
  { code: 'cs', name: 'Czech' },
  { code: 'da', name: 'Danish' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'et', name: 'Estonian' },
  { code: 'eu', name: 'Basque' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'ga', name: 'Irish' },
  { code: 'gl', name: 'Galician' },
  { code: 'hr', name: 'Croatian' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'it', name: 'Italian' },
  { code: 'lb', name: 'Luxembourgish' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'lv', name: 'Latvian' },
  { code: 'mt', name: 'Maltese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'no', name: 'Norwegian' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ro', name: 'Romanian' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'sv', name: 'Swedish' },
  { code: 'tr', name: 'Turkish' },
];

// European countries with ISO 3166-1 codes
const europeanCountries = [
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'HR', name: 'Croatia' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DK', name: 'Denmark' },
  { code: 'EE', name: 'Estonia' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'GR', name: 'Greece' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IT', name: 'Italy' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MT', name: 'Malta' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'RO', name: 'Romania' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'ES', name: 'Spain' },
  { code: 'SE', name: 'Sweden' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'NO', name: 'Norway' },
];

const selectedLanguage = ref(null);
const selectedRegion = ref(null);
const isCopied = ref(false);
const languageSearchTerm = ref('');
const countrySearchTerm = ref('');

// Reset both selections
function resetSelections() {
  selectedLanguage.value = null;
  selectedRegion.value = null;
  languageSearchTerm.value = '';
  countrySearchTerm.value = '';
}

// Filter languages based on selected region
const filteredLanguages = computed(() => {
  if (!selectedRegion.value) {
    return commonLanguages;
  }
  
  const languageCodes = countryLanguageMap[selectedRegion.value.code] || [];
  return commonLanguages.filter(lang => languageCodes.includes(lang.code));
});

// Apply search term to languages
const displayedLanguages = computed(() => {
  if (!languageSearchTerm.value.trim()) {
    return filteredLanguages.value;
  }
  
  const searchTerm = languageSearchTerm.value.toLowerCase();
  return filteredLanguages.value.filter(lang => 
    lang.name.toLowerCase().includes(searchTerm) || 
    lang.code.toLowerCase().includes(searchTerm)
  );
});

// Filter countries based on selected language
const filteredCountries = computed(() => {
  if (!selectedLanguage.value) {
    return europeanCountries;
  }
  
  const countryCodes = languageCountryMap[selectedLanguage.value.code] || [];
  return europeanCountries.filter(country => countryCodes.includes(country.code));
});

// Apply search term to countries
const displayedCountries = computed(() => {
  if (!countrySearchTerm.value.trim()) {
    return filteredCountries.value;
  }
  
  const searchTerm = countrySearchTerm.value.toLowerCase();
  return filteredCountries.value.filter(country => 
    country.name.toLowerCase().includes(searchTerm) || 
    country.code.toLowerCase().includes(searchTerm)
  );
});

// Construct BCP-47 language tag
const constructedTag = computed(() => {
  if (!selectedLanguage.value) return '';
  
  let tag = selectedLanguage.value.code;
  
  if (selectedRegion.value) {
    tag += '-' + selectedRegion.value.code;
  }
  
  return tag;
});

// Validate the tag automatically
const isTagValid = computed(() => {
  if (!constructedTag.value) return false;
  const validation = validateLanguageTag(constructedTag.value);
  return validation.isValid;
});

// Selection functions
function selectLanguage(lang) {
  selectedLanguage.value = lang;
  languageSearchTerm.value = lang.name;
  
  // If the currently selected region is not valid for this language, reset it
  if (selectedRegion.value) {
    const validForRegion = countryLanguageMap[selectedRegion.value.code]?.includes(lang.code);
    if (!validForRegion) {
      selectedRegion.value = null;
      countrySearchTerm.value = '';
    }
  }
  
  // If there's only one country for this language, auto-select it
  const countriesForLang = languageCountryMap[lang.code] || [];
  if (countriesForLang.length === 1 && !selectedRegion.value) {
    const targetCountry = europeanCountries.find(c => c.code === countriesForLang[0]);
    if (targetCountry) {
      selectedRegion.value = targetCountry;
      countrySearchTerm.value = targetCountry.name;
    }
  }
}

function selectRegion(region) {
  selectedRegion.value = region;
  countrySearchTerm.value = region.name;
  
  // If the currently selected language is not valid for this region, reset it
  if (selectedLanguage.value) {
    const validForLanguage = languageCountryMap[selectedLanguage.value.code]?.includes(region.code);
    if (!validForLanguage) {
      selectedLanguage.value = null;
      languageSearchTerm.value = '';
    }
  }
  
  // If there's only one language for this region, auto-select it
  const langsForRegion = countryLanguageMap[region.code] || [];
  if (langsForRegion.length === 1 && !selectedLanguage.value) {
    const targetLang = commonLanguages.find(l => l.code === langsForRegion[0]);
    if (targetLang) {
      selectedLanguage.value = targetLang;
      languageSearchTerm.value = targetLang.name;
    }
  }
}

// Copy to clipboard function
function copyToClipboard() {
  if (!constructedTag.value) return;
  
  navigator.clipboard.writeText(constructedTag.value).then(() => {
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  });
}
</script>

<style scoped>
.language-search-builder {
  padding: 10px;
  margin-bottom: 1.5rem;
}

.compact-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.lists-section {
  display: flex;
  gap: 15px;
}

.list-section {
  flex: 1;
  min-width: 200px;
}

h3 {
  margin-top: 0;
  margin-bottom: 8px;
  color: var(--vp-c-brand);
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.filter-hint {
  margin-left: 6px;
  font-size: 0.75rem;
  font-weight: normal;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.search-field {
  position: relative;
  margin-bottom: 8px;
}

.search-input {
  width: 100%;
  padding: 6px 30px 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  font-size: 0.85rem;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.search-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
}

.clear-search {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--vp-c-text-2);
  font-size: 1rem;
  cursor: pointer;
  padding: 0 5px;
}

.clear-search:hover {
  color: var(--vp-c-text-1);
}

.list-container {
  max-height: 250px;
  overflow-y: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background-color: var(--vp-c-bg);
  position: relative;
}

.list-item {
  display: flex;
  padding: 6px 10px;
  cursor: pointer;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.9rem;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item:hover {
  background-color: var(--vp-c-bg-soft);
}

.list-item.selected {
  background-color: var(--vp-c-brand-dimm);
  font-weight: 500;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: var(--vp-c-text-2);
  font-style: italic;
  font-size: 0.85rem;
  text-align: center;
  height: 100px;
}

.item-code {
  font-weight: bold;
  min-width: 40px;
  font-size: 0.85rem;
}

.item-name {
  flex: 1;
}

.result-display {
  margin-top: 10px;
  width: 100%;
}

.tag-with-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tag-input-group {
  display: flex;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
}

.tag-text {
  flex: 1;
  padding: 8px 12px;
  font-family: monospace;
  font-size: 1.2rem;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border-right: 1px solid var(--vp-c-divider);
}

.tag-text.valid {
  color: var(--vp-c-green);
  font-weight: bold;
}

.tag-text.empty {
  color: var(--vp-c-text-2);
  font-style: italic;
  font-size: 0.9rem;
}

.selections-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selections {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  padding: 0 4px;
}

.selection-label {
  font-weight: 500;
}

.selection-separator {
  margin: 0 5px;
  color: var(--vp-c-divider);
}

.action-button {
  padding: 8px 15px;
  border: none;
  background-color: var(--vp-c-brand);
  color: white;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.copy-button.valid {
  background-color: var(--vp-c-green);
}

.reset-button {
  padding: 4px 10px;
  border: none;
  border-radius: 4px;
  background-color: var(--vp-c-danger);
  color: white;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-button:hover {
  background-color: var(--vp-c-danger-dark);
  opacity: 0.9;
}

.action-button:hover {
  opacity: 0.9;
}

.action-button:disabled {
  background-color: var(--vp-c-gray);
  cursor: not-allowed;
}

.icon {
  font-size: 1.1rem;
}

.support-section {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

.coffee-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #FFDD00;
  color: #000000;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 8px 16px;
  border-radius: 5px;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.coffee-button:hover {
  background-color: #FFD000;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.coffee-icon {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .lists-section {
    flex-direction: column;
  }
  
  .list-section {
    width: 100%;
  }
  
  .tag-text {
    font-size: 1rem;
  }
}
</style> 