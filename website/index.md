---
layout: home
hero:
  name: ally-bcp-47
  text: BCP-47 Language Tag Validation
  tagline: A comprehensive TypeScript library for validating, parsing, and canonicalizing BCP-47 language tags
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: View on GitHub
      link: https://github.com/AleksejDix/ally-lang
features:
  - icon: 🔍
    title: Complete Validation
    details: Fully validates language tags against the RFC 5646 specification including syntax and registry validation
  - icon: 🌐
    title: Accessibility Ready
    details: Ensures compliance with ADA, Section 508, and European Accessibility Act requirements
  - icon: ⚡
    title: Lightweight & Fast
    details: Optimized for performance with minimal dependencies
  - icon: 🧩
    title: TypeScript Support
    details: First-class TypeScript support with complete type definitions
---

<div class="validator-container">
  <h2>Try it out</h2>
  <LanguageTagValidator />
</div>

<style>
.validator-container {
  margin: 3rem auto;
  max-width: 60rem;
  padding: 2rem;
  text-align: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
}
</style>
