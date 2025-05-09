---
layout: home
hero:
  name: ally-bcp-47
  text: BCP-47 Language Tag Validation
  tagline: A comprehensive TypeScript library for validating, parsing, and canonicalizing BCP-47 language tags
  image:
    src: /logo.png
    alt: ally-bcp47 logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: View on GitHub
      link: https://github.com/AleksejDix/ally-bcp47
features:
  - icon: 🔍
    title: Complete Validation
    details: Fully validates language tags against the RFC 5646 specification including syntax and registry validation
  - icon: 🌐
    title: Accessibility Ready
    details: Ensures compliance with ADA, Section 508, and European Accessibility Act requirements
  - icon: ⚡
    title: Lightweight & Fast
    details: Fully tree-shakable with minimal footprint (1KB for single function imports). Optimized for performance with zero dependencies.
  - icon: 🧩
    title: TypeScript Support
    details: First-class TypeScript support with complete type definitions
---

<div class="search-builder-container">
  <h2>Build Your Language Tag</h2>
  <p>Search for your language and country to build a correct BCP-47 language tag</p>
  <LanguageSearchBuilder />
</div>

<div class="validator-container">
  <h2>Try it out</h2>
  <LanguageTagValidator />
</div>

<style>
.hero-section {
  margin: 4rem auto;
  max-width: 90rem;
  display: flex;
  justify-content: center;
}

.visualization-container {
  width: 90%;
  max-width: 70rem;
  padding: 2rem;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.visualization-container h3 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--vp-c-brand);
}

.search-builder-container {
  margin: 3rem auto;
  max-width: 80rem;
  padding: 1rem;
  text-align: center;
}

.validator-container {
  margin: 3rem auto;
  max-width: 60rem;
  padding: 2rem;
  text-align: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
}

@media (max-width: 768px) {
  .visualization-container {
    padding: 1.5rem;
  }
}
</style>

<script setup>
import LanguageTagValidator from './.vitepress/components/LanguageTagValidator.vue'
import LanguageSearchBuilder from './.vitepress/components/LanguageSearchBuilder.vue'
</script>
