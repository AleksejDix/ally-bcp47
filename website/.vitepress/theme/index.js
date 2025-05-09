import { h } from "vue";
import DefaultTheme from "vitepress/theme";
import LanguageTagValidator from "../components/LanguageTagValidator.vue";
import TagStructureVisual from "../components/TagStructureVisual.vue";
import InteractiveTagBuilder from "../components/InteractiveTagBuilder.vue";
import "./custom.css";

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component("LanguageTagValidator", LanguageTagValidator);
    app.component("TagStructureVisual", TagStructureVisual);
    app.component("InteractiveTagBuilder", InteractiveTagBuilder);
  },
};
