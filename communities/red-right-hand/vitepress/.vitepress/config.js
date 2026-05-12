import { withPwa } from "@vite-pwa/vitepress";
import { defineConfig } from "vitepress";

import { tabsMarkdownPlugin } from "vitepress-plugin-tabs";

const handbookLinkItems = [
  { text: "Introduction", link: "/handbook/" },
  { text: "Charter", link: "/handbook/charter" },
  { text: "Manifesto", link: "/handbook/manifesto" },
  { text: "Behind the Name", link: "/handbook/behind-the-name" },
  { text: "Ranks", link: "/handbook/ranks" },
  { text: "Fleet Composition", link: "/handbook/fleet-composition" },
];

// https://vitepress.dev/reference/site-config
export default withPwa(
  defineConfig({
    lang: "en-GB",

    srcDir: "markdown",

    title: "Red Right Hand Vitepress",
    description: "CuntCuntCunt",

    sitemap: {
      hostname: "https://vitepress.red-right-hand.unnamed.group",
    },

    markdown: {
      image: {
        lazyLoading: true,
      },
      math: true,
      config(md) {
        md.use(tabsMarkdownPlugin);
      },
    },

    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      nav: [
        { text: "Home", link: "/" },
        {
          text: "Handbook",
          items: handbookLinkItems,
        },
        { text: "Databank", link: "/databank/index" },
      ],

      sidebar: {
        "/handbook/": [
          {
            text: "Handbook",
            items: handbookLinkItems,
          },
        ],
      },

      socialLinks: [
        {
          icon: "github",
          link: "https://github.com/zuedev/red-right-hand/tree/main/projects/vitepress",
        },
      ],

      search: {
        provider: "local",
      },

      editLink: {
        pattern:
          "https://github.com/zuedev/red-right-hand/edit/main/projects/vitepress/:path",
      },

      lastUpdated: true,

      footer: {
        message:
          "This site is not endorsed by or affiliated with the Cloud Imperium or Roberts Space Industries group of companies. All game content and materials are copyright Cloud Imperium Rights LLC and Cloud Imperium Rights Ltd.. Star Citizen, Squadron 42, Roberts Space Industries®, and Cloud Imperium® are registered trademarks of Cloud Imperium Rights LLC. All rights reserved.",
        copyright:
          "All other content is dedicated to the public domain under the <a href='https://unlicense.org/'>Unlicense</a>.",
      },
    },

    head: [
      ["link", { rel: "icon", href: "/logo.png" }],
      ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
      [
        "link",
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
      ],
      [
        "link",
        {
          href: "https://fonts.googleapis.com/css2?family=Inter&display=swap",
          rel: "stylesheet",
        },
      ],
      [
        "link",
        {
          href: "https://fonts.googleapis.com/css2?family=Fira+Code&display=swap",
          rel: "stylesheet",
        },
      ],
      // [
      //   "script",
      //   { id: "register-sw" },
      //   `;(() => {
      //   if ('serviceWorker' in navigator) {
      //     navigator.serviceWorker.register('/sw.js')
      //   }
      // })()`,
      // ],
    ],

    pwa: {
      strategies: "generateSW", // <== if omitted, defaults to `generateSW`
      workbox: {
        /* your workbox configuration if any */
      },
      experimental: {
        includeAllowlist: true,
      },
    },
  }),
);
