export default {
  title: "ally-bcp-47",
  description: "A comprehensive BCP-47 language tag validation library",
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
  ],
  themeConfig: {
    logo: "/logo.svg",
    nav: [
      { text: "Home", link: "/" },
      { text: "Articles", link: "/articles/" },
      { text: "Guide", link: "/guide/" },
      { text: "API", link: "/api/" },
      { text: "Examples", link: "/examples/" },
      { text: "GitHub", link: "https://github.com/AleksejDix/ally-bcp47" },
    ],
    sidebar: {
      "/articles/": [
        {
          text: "Articles",
          items: [
            { text: "Overview", link: "/articles/" },
            { text: "Language Tags & SEO", link: "/articles/language-seo" },
            {
              text: "Language & Accessibility",
              link: "/articles/language-accessibility",
            },
            {
              text: "WebAIM Report on Language",
              link: "/articles/webaim-language-issues",
            },
            {
              text: "Common Language Mistakes",
              link: "/articles/common-mistakes",
            },
            {
              text: "Library Comparisons",
              link: "/articles/library-comparisons",
            },
            {
              text: "Framework Guides",
              items: [
                {
                  text: "React Implementation",
                  link: "/articles/frameworks/react",
                },
                {
                  text: "Vue Implementation",
                  link: "/articles/frameworks/vue",
                },
                {
                  text: "Angular Implementation",
                  link: "/articles/frameworks/angular",
                },
              ],
            },
            {
              text: "Building a Language Switcher",
              link: "/articles/language-switcher",
            },
          ],
        },
      ],
      "/guide/": [
        {
          text: "Introduction",
          items: [
            { text: "What is BCP-47?", link: "/guide/" },
            { text: "Getting Started", link: "/guide/getting-started" },
            { text: "Installation", link: "/guide/installation" },
          ],
        },
        {
          text: "Core Concepts",
          items: [
            { text: "Language Tags", link: "/guide/language-tags" },
            { text: "Validation", link: "/guide/validation" },
            { text: "Parsing", link: "/guide/parsing" },
            { text: "Canonicalization", link: "/guide/canonicalization" },
          ],
        },
        {
          text: "Compliance",
          items: [
            { text: "ADA Compliance", link: "/guide/ada-compliance" },
            {
              text: "Section 508 Compliance",
              link: "/guide/section508-compliance",
            },
            { text: "EAA Compliance", link: "/guide/eaa-compliance" },
          ],
        },
      ],
      "/api/": [
        {
          text: "API Reference",
          items: [
            { text: "Overview", link: "/api/" },
            { text: "validateLanguageTag", link: "/api/validate-language-tag" },
            { text: "isValid", link: "/api/is-valid" },
            { text: "isWellFormed", link: "/api/is-well-formed" },
            { text: "parseTag", link: "/api/parse-tag" },
            { text: "canonicalizeTag", link: "/api/canonicalize-tag" },
          ],
        },
      ],
      "/examples/": [
        {
          text: "Examples",
          items: [
            { text: "Basic Validation", link: "/examples/" },
            { text: "Interactive Demos", link: "/examples/interactive-demos" },
            { text: "Error Handling", link: "/examples/error-handling" },
            {
              text: "Working with Parsed Tags",
              link: "/examples/working-with-parsed-tags",
            },
            { text: "Canonicalization", link: "/examples/canonicalization" },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/AleksejDix/ally-bcp47" },
    ],
    footer: {
      message: "Powered by <a href=\"https://allyship.dev/\" target=\"_blank\">Allyship.dev</a>",
      copyright: "Copyright © 2023-present | Made by Aleksej Dix | Released under the MIT License",
    },
  },
};
