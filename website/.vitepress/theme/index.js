import { h } from "vue";
import DefaultTheme from "vitepress/theme";
import LanguageTagValidator from "../components/LanguageTagValidator.vue";
import TagStructureVisual from "../components/TagStructureVisual.vue";
import InteractiveTagBuilder from "../components/InteractiveTagBuilder.vue";
import TopBanner from "../components/TopBanner.vue";
import "./custom.css";

// Create a custom layout that extends the default one
function Layout() {
  return h(DefaultTheme.Layout, null, {
    // Add the Buy Me a Coffee banner after the outline (below "On this page" section)
    'aside-outline-after': () => h(TopBanner)
  });
}

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component("LanguageTagValidator", LanguageTagValidator);
    app.component("TagStructureVisual", TagStructureVisual);
    app.component("InteractiveTagBuilder", InteractiveTagBuilder);
  },
};
