// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import DefaultTheme from "vitepress/theme";
import "./style.css";

import ReloadPrompt from "./components/ReloadPrompt.vue";

import { enhanceAppWithTabs } from "vitepress-plugin-tabs/client";

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      "doc-before": () =>
        h(
          "p",
          {
            style: {
              backgroundColor: "yellow",
              color: "#111",
              padding: "0.75rem 1rem",
              fontWeight: "600",
              display: "block",
              marginBottom: "1rem",
            },
          },
          "WARNING: This documentation is very early and incomplete. It may contain inaccurate or missing content. Do not rely on this information yet. For official information, please refer to the classified channels or contact your commanding officer.",
        ),
      "layout-bottom": () => h(ReloadPrompt),
    });
  },
  enhanceApp({ app, router, siteData }) {
    enhanceAppWithTabs(app);
  },
};
