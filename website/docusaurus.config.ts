import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const config: Config = {
  title: "Alex Baker · Research Documentation",
  tagline:
    "Technical and scientific reference for astrophysics, astro-ML, and computational physics.",
  favicon: "img/favicon.ico",

  url: "https://phd-brown.github.io",
  baseUrl: "/research-docs/",

  organizationName: "PhD-Brown",
  projectName: "research-docs",

  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",

  trailingSlash: false,

  future: {
    v4: true,
  },

  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-odtC4UGzz0/zFqN82N020ZJ20BtcP81Ekt09yLff7fXz4eBtk0EihP+RkI5Gq0b",
      crossorigin: "anonymous",
    },
  ],

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],
  
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  // ── Main preset (AstroSpectro docs + theme) ──────────────────────────────
  presets: [
    [
      "classic",
      {
        docs: {
          path: "docs",
          routeBasePath: "docs",
          sidebarPath: "./sidebars.ts",
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          showLastUpdateTime: false,
          showLastUpdateAuthor: true,
        },
        blog: {
          path: "blog",
          routeBasePath: "journal",
          blogTitle: "Journal de Bord",
          blogDescription: "Research log — AstroSpectro, AstroVision, ξ Dark Energy.",
          postsPerPage: 10,
          blogSidebarTitle: "Recent entries",
          showReadingTime: true,
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  // ── Additional doc instances ──────────────────────────────────────────────
  plugins: [
    "docusaurus-plugin-image-zoom", // <-- Ajout du plugin de zoom ici
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "astrovision",
        path: "docs-astrovision",
        routeBasePath: "astrovision",
        sidebarPath: "./sidebars-astrovision.ts",
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "xi-dark-energy",
        path: "docs-xi",
        routeBasePath: "xi-dark-energy",
        sidebarPath: "./sidebars-xi.ts",
        remarkPlugins: [remarkMath],
      },
    ],
  ],

  // ── Theme ─────────────────────────────────────────────────────────────────
  themeConfig: {
    image: "img/social-card.png",

    // <-- Configuration du zoom ajoutée ici
    zoom: {
      selector: '.markdown :not(em) > img',
      background: {
        light: 'rgb(255, 255, 255)',
        dark: 'rgb(50, 50, 50)'
      },
      config: {
        // Optionnel : ajuste l'espace autour de l'image zoomée
        margin: 24
      }
    },

    navbar: {
      title: "Alex Baker",
      logo: {
        alt: "AB Research",
        src: "img/logo.png",
      },
      items: [
        // ── Projects ──────────────────────────────────────────────────────
        {
          type: "docSidebar",
          sidebarId: "astrospectroSidebar",
          position: "left",
          label: "AstroSpectro",
        },
        {
          to: "/astrovision",
          docsPluginId: "astrovision",
          label: "AstroVision",
          position: "left",
        },
        {
          to: "/xi-dark-energy",
          docsPluginId: "xi-dark-energy",
          label: "ξ Dark Energy",
          position: "left",
        },
        // ── Other ─────────────────────────────────────────────────────────
        {
          to: "/journal",
          label: "Journal",
          position: "left",
        },
        {
          to: "/docs",
          label: "Docs home",
          position: "left",
        },
        // ── Right ─────────────────────────────────────────────────────────
        {
          href: "https://phd-brown.github.io",
          label: "Personal site",
          position: "right",
        },
        {
          href: "https://github.com/PhD-Brown",
          label: "GitHub",
          position: "right",
        },
      ],
    },

    footer: {
      style: "dark",
      links: [
        {
          title: "Projects",
          items: [
            { label: "AstroSpectro", to: "/docs/astrospectro/overview/" },
            { label: "AstroVision", to: "/astrovision/" },
            { label: "ξ Dark Energy", to: "/xi-dark-energy/" },
          ],
        },
        {
          title: "Reference",
          items: [
            { label: "Glossary", to: "/docs/atlas/glossary" },
            { label: "Methods Index", to: "/docs/atlas/methods-index" },
            { label: "Reading Paths", to: "/docs/reading-paths" },
            { label: "Journal", to: "/journal" },
          ],
        },
        {
          title: "Links",
          items: [
            {
              label: "Personal Site",
              href: "https://phd-brown.github.io",
            },
            {
              label: "GitHub",
              href: "https://github.com/PhD-Brown",
            },
            {
              label: "ORCID",
              href: "https://orcid.org/0009-0007-3242-1829",
            },
            {
              label: "Contact",
              href: "mailto:albak1@ulaval.ca",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Alex Baker. Built with Docusaurus. MIT License.`,
    },

    prism: {
      additionalLanguages: ["python", "bash", "yaml", "json"],
    },

    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;