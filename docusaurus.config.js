import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Alejandro García Peláez",
  tagline: "From curiosity to creation",
  favicon: "img/favicon.ico",

  future: {
    v4: true,
  },

  // Set the production url of your site here
  url: "https://your-docusaurus-site.example.com",
  baseUrl: "/",

  organizationName: "aleph8",
  projectName: "aleph8.github.io",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false,
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          editUrl:
            "https://github.com/aleph8/aleph8.github.io/tree/main/",
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "panoruma",
        path: "docs/panoruma",
        routeBasePath: "panoruma",
        sidebarPath: "./sidebars_panoruma.js",
        editUrl:
          "https://github.com/aleph8/aleph8.github.io/tree/main/",
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "vt4ai",
        path: "docs/vt4ai",
        routeBasePath: "vt4ai",
        sidebarPath: "./sidebars_vt4ai.js",
        editUrl:
          "https://github.com/aleph8/aleph8.github.io/tree/main/",
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        hideOnScroll: false,
        title: "AGP",
        logo: {
          alt: "AGP LOGO",
          src: "img/logo.svg",
          srcDark: "img/logo.svg",
          width: 40,
          height: 40,
        },
        items: [
          {
            to: "/",
            label: "Home",
            position: "right",
          },
          {
            type: 'dropdown',
            label: 'Docs',
            position: 'right',
            items: [
              {
                to: "/vt4ai/intro",
                label: "VT4AI",
              },
              // {
              //   to: "/panoruma/intro",
              //   label: "Panoruma",
              // },
            ],
          },
          {
            to: "/about",
            label: "About me",
            position: "right",
          },
          // { to: "/blog", label: "Blog", position: "left" },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Panoruma",
                to: "/panoruma/intro",
              },
              {
                label: "VT4AI",
                to: "/vt4ai/intro",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Blog",
                to: "/blog",
              },
              {
                label: "GitHub",
                href: "https://github.com/aleph8",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Aleph. Construido con ❤️ y Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
