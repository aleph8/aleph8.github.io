# AGENT.md - Agent Instructions

This document describes how to work with this project in future sessions.

## Language Policy

**All code, comments, documentation files (including this file), commit messages, and agent instructions must be written in English**, unless the user explicitly requests otherwise. Content collections (blog posts, project pages) may be written in Spanish (`es/`) or English (`en/`) according to the i18n structure.

---

## Stack

| Technology | Version | Purpose |
|---|---|---|
| [Astro](https://astro.build/) | 5+ | Static site framework |
| [Tailwind CSS v4](https://tailwindcss.com/) | 4+ | Styling (via `@tailwindcss/vite` Vite plugin) |
| [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) | 0.5+ | Prose/markdown styles |
| [@astrojs/mdx](https://docs.astro.build/en/guides/integrations-guide/mdx/) | 4+ | MDX support in content collections |
| [@astrojs/rss](https://docs.astro.build/en/guides/rss/) | 4+ | RSS feed at `/rss.xml` |
| [Mermaid.js](https://mermaid.js.org/) | 11 (CDN) | Diagram rendering (client-side, no install) |
| Docker + Docker Compose | - | Isolated development environment |
| GitHub Actions | - | CI/CD → GitHub Pages |

---

## Environment Rules

**Everything runs inside Docker.** Do not install anything on the host.

```bash
# Start dev server
docker compose up -d
# → available at http://localhost:4321

# Install a new dependency
docker compose run --rm astro npm install <package>

# Production build
docker compose run --rm astro npm run build

# View logs
docker compose logs astro
docker compose logs -f astro   # live
```

---

## Project Structure

```
/
├── src/
│   ├── content/               # Astro Content Collections
│   │   ├── config.ts          # Zod schemas for all collections
│   │   ├── posts/
│   │   │   ├── en/            # English blog posts (.md / .mdx)
│   │   │   └── es/            # Spanish blog posts (.md / .mdx)
│   │   ├── projects/
│   │   │   ├── en/            # English project pages organized by project
│   │   │   └── es/            # Spanish project pages organized by project
│   │   ├── authors/           # Author JSON files (global)
│   │   └── tags/              # Tag JSON files (global)
│   ├── i18n/
│   │   ├── locales/
│   │   │   ├── en.json        # English UI strings
│   │   │   └── es.json        # Spanish UI strings
│   │   └── utils.ts           # useTranslations(lang) hook
│   ├── layouts/
│   │   ├── BaseLayout.astro   # Main layout (nav, footer, scroll-hide, Mermaid CDN)
│   │   ├── PostLayout.astro   # Blog post layout (cover image, author, tags)
│   │   └── DocsLayout.astro   # Project layout (sidebar with intro/docs split + breadcrumb)
│   ├── components/
│   │   ├── MainPage.astro     # Landing page component (reused for EN/ES)
│   │   ├── BlogIndex.astro    # Blog listing component (reused for EN/ES)
│   │   └── DocsIndex.astro    # Projects listing component (reused for EN/ES)
│   ├── pages/
│   │   ├── index.astro        # EN landing (/)
│   │   ├── about.astro        # EN about page (/about)
│   │   ├── graph.astro        # Knowledge graph + game (/graph)
│   │   ├── blog/
│   │   │   ├── index.astro    # EN blog listing (/blog)
│   │   │   └── [...slug].astro # EN post routes (/blog/slug)
│   │   ├── projects/
│   │   │   ├── index.astro    # EN projects listing (/projects)
│   │   │   └── [...slug].astro # EN project routes (/projects/name/slug)
│   │   ├── es/                # Spanish locale prefix
│   │   │   ├── index.astro    # ES landing (/es)
│   │   │   ├── about.astro    # ES about page (/es/about)
│   │   │   ├── blog/          # ES blog (/es/blog)
│   │   │   └── projects/      # ES projects (/es/projects)
│   │   └── rss.xml.js         # RSS feed
│   ├── invaders/              # Knowledge graph + game JS modules
│   │   ├── main.js            # Entry point: graph init, HUD, event listeners
│   │   ├── graph-renderer.js  # Force-directed graph rendering (explore mode)
│   │   ├── game.js            # Core game loop and state machine
│   │   ├── player.js          # Player ship: movement, weapons, relics
│   │   ├── enemy.js           # Enemy types: standard, boss, splitter, shielded, hacker
│   │   ├── bullet.js          # Bullet pool: movement, modifiers (homing, piercing, explosive, wave)
│   │   ├── shop.js            # Shop: item availability, purchasing, relic logic
│   │   ├── waves.js           # Wave progression and shop trigger
│   │   └── constants.js       # Game constants and SHOP_ITEMS catalog
│   └── styles/
│       └── global.css         # Global CSS (Tailwind v4, grid background, content-page effect)
├── public/
│   ├── authors/               # Author avatars (e.g. aleph.png) - served locally, no CDN
│   └── blog/                  # Static assets for blog posts (iframes, cover images)
├── .github/workflows/
│   └── deploy.yml             # CI/CD: build + deploy to GitHub Pages on push to main
├── Dockerfile                 # Node 20 Alpine + python3/make/g++
├── docker-compose.yaml        # Named volume for node_modules
├── astro.config.mjs           # Astro config (static, i18n, MDX, Tailwind, excludeLangs)
└── AGENT.md                   # This file
```

---

## Content Collections

### Schemas (`src/content/config.ts`)

| Collection | Type | Required fields | Optional fields |
|---|---|---|---|
| `posts` | `content` (md/mdx) | `title`, `description`, `pubDate`, `author` (ref), `tags` (ref[]) | `image`, `draft` |
| `projects` | `content` (md/mdx) | `title` | `description`, `order`, `sidebar_label`, `tech` |
| `authors` | `data` (json) | `name` | `bio`, `avatar`, `socials` |
| `tags` | `data` (json) | `name` | `description` |

### Adding a new post

Create `src/content/posts/<lang>/my-post.md`:

```md
---
title: "Post title"
description: "Short description."
pubDate: 2026-03-30
author: aleph
tags: ["ai", "cybersecurity"]
image: ../../../assets/blog/my-post-cover.jpg   # optional - place image in src/assets/blog/
---

Content in Markdown or MDX...
```

- The author (`aleph`) must exist as `src/content/authors/aleph.json`.
- Each tag must exist as `src/content/tags/<tag>.json`.
- `image` is optional but recommended - it shows as a thumbnail in the listing, a cover inside the post, and populates `og:image` for social sharing.

### Adding a new tag

```json
// src/content/tags/new-tag.json
{ "name": "Visible name", "description": "Optional description." }
```

### Adding a project

Each project lives in `src/content/projects/<lang>/<project-name>/`. The required entry point is `intro.md`, which acts as the project overview and populates the projects index page.

**`intro.md` frontmatter:**

```md
---
order: 1
title: "Project Name"
description: "One-line description shown on the /projects index."
tech: "Cybersecurity"   # shown as a tag on the index (e.g. Cybersecurity, History)
image: "../../../../assets/projects/my-project.webp" # shown in the projects index gallery
---

Project overview content...
```

Additional pages (docs, guides, reference) go in subdirectories or alongside `intro.md`. The `order` field controls sidebar ordering. Use `sidebar_label` to override the title in the sidebar.

**Convention**: pages named `intro.md` are treated as the project introduction - they appear first in the sidebar with higher visual prominence and a `Docs` sub-label separates them from the rest.

---

## Hero (Landing Page)

`MainPage.astro` renders the hero with a **random rotating headline** on each page load. Phrases are defined in an inline `<script define:vars={{ lang }}>` array with two languages (EN/ES). Each phrase has one accent-colored word via `<span class="text-accent">`.

To add or change phrases, edit the `phrases` object directly in `MainPage.astro`.

The hero also includes:
- **Author name** (`hero.title` i18n key) - small mono label above the headline
- **Context badge** - accent-colored pill with a dot: `hero.badge` key (e.g. "Málaga · AI & Security · VirusTotal")
- **Description** - `hero.description` key, one short sentence with personality
- **About me link** - links to `/about` or `/es/about`, text from `hero.about_link` key

The "Recent Writing" and "Related Projects" sections below the hero are wrapped in a `<div>` with horizontal-only white shadow (`box-shadow: 100px 0 50px 60px white, -100px 0 50px 60px white`) to create a floating "paper" effect over the grid without bleeding into the hero.

---

## Mermaid Diagrams

Diagrams are rendered **client-side** via Mermaid.js loaded from CDN. No build-time dependencies.

- Write diagrams as ` ```mermaid ` code blocks in any markdown/MDX file.
- `astro.config.mjs` excludes `mermaid` from Shiki syntax highlighting.
- `BaseLayout.astro` loads Mermaid from `cdn.jsdelivr.net` and replaces `<pre><code class="language-mermaid">` elements with rendered SVGs.
- Diagrams are centered via `.mermaid-diagram` CSS class in `global.css`.

---

## i18n

The site supports English (default, no prefix) and Spanish (under `/es/`).

- **Config**: `astro.config.mjs` → `i18n` block.
- **Dictionaries**: `src/i18n/locales/*.json`.
- **Utilities**: `src/i18n/utils.ts` → `useTranslations(lang)`.
- **Routes**: `/` and `/es/`, `/blog` and `/es/blog`, `/projects` and `/es/projects`, `/about` and `/es/about`.
- **Language switcher**: Always shows `EN / ES` in fixed order in the navbar. Active language is black, inactive is `text-neutral-500`.

### Key i18n keys

| Key | Purpose |
|---|---|
| `nav.writing` | Navbar: Writing link |
| `nav.projects` | Navbar: Projects link |
| `nav.about` | Navbar: About link |
| `hero.title` | Author name shown above headline |
| `hero.badge` | Context badge text (role/location pill) |
| `hero.headline` | Default headline (overridden by JS random phrases) |
| `hero.description` | Hero subtext |
| `hero.about_link` | "About me" link label |
| `section.recent_writing` | Section heading on landing |
| `section.projects` | Section heading on landing |
| `projects.vt4ai.description` | VT4AI description on landing |
| `projects.panoruma.description` | Panoruma description on landing |
| `footer.rights` | Footer copyright name |

---

## Design

- **Palette**: background `#ffffff`, text `#000000`, accent `#667eea`
- **Philosophy**: typography-first, no decorative noise, max content width `max-w-3xl` (blog/pages) or `max-w-5xl` (projects with sidebar)
- **Fonts**: Inter (sans), JetBrains Mono (mono) - loaded from Google Fonts
- **Accent**: used on link hover, mono labels, section headings, hero badge, key words in hero headline, and left border of code blocks/blockquotes. Not in page backgrounds or buttons.
- **No dark mode**: `color-scheme: light` is forced on `<body>`. Pure white always.
- **Mobile-first**: `md:grid-cols-*` for project sidebar, `sm:flex-row` for lists.
- **Navbar**: fixed, hides on scroll down, reappears on scroll up (vanilla JS in `BaseLayout.astro`). Links: Writing · Projects · About · EN/ES switcher.
- **Footer**: Graph · RSS · GitHub · X · LinkedIn

### Grid background

`global.css` applies a hybrid background to `<body>` representing the scientific (grid) and humanistic (lines) halves. It uses a `linear-gradient` for horizontal lines across the whole page and a `repeating-linear-gradient` for vertical lines limited to the left 50% of the screen:

```css
background-image:
  /* Horizontal lines: everywhere */
  linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px),
  /* Vertical lines: left 50% only */
  repeating-linear-gradient(to right, rgba(0,0,0,0.07) 0px, rgba(0,0,0,0.07) 1px, transparent 1px, transparent 64px);
background-size: 100% 64px, 50% 100%;
background-repeat: repeat, no-repeat;
background-attachment: fixed, fixed;
```

Mobile falls back to `background-attachment: scroll` (iOS compatibility).

### Content-page effect ("paper on grid")

`BaseLayout.astro` accepts a `contentPage: boolean` prop. When `true`, the `<main>` element gets class `content-page`, which applies:

```css
.content-page {
  background-color: white;
  box-shadow: 0 0 60px 80px white;
}
```

This makes the content area opaque white while the `box-shadow` spreads a white halo outward, creating a smooth fade into the surrounding grid. Applied to: `PostLayout`, `DocsLayout`, `BlogIndex`, `DocsIndex`, `about.astro`.

The landing page uses a **horizontal-only** variant on the sections div (no upward bleed into the hero):
```html
<div style="background:white; box-shadow: 100px 0 50px 60px white, -100px 0 50px 60px white;">
```

### Section headings

All `RECENT WRITING` / `RELATED PROJECTS` style labels use `text-accent` (accent color) instead of neutral gray, making sections easier to scan.

### About page

`/about` and `/es/about` are standalone Astro pages (not components) that use `BaseLayout` directly with `contentPage={true}`. They contain structured bio sections ("Current Role", "What Drives Me") with accent-colored section labels and `border-accent/15` separators.

### Author avatar
Stored locally at `public/authors/aleph.png`. Do not load from external services (GitHub CDN, Gravatar, etc.).

---

## CI/CD

- Push to `main` → GitHub Actions runs `npm install` + `npm run build` → deploys `dist/` to GitHub Pages.
- Active working branch is `feat/rework` → open a PR to `main` to deploy.
- Site lives at `https://alejandrogp.com` (configured in `astro.config.mjs` → `site`).

---

## Known Gotchas

- **Do not use `@import "tailwindcss/typography"`** - breaks with Tailwind v4. Use `@plugin "@tailwindcss/typography"`.
- **Post slugs**: Astro v5 uses the filename as `id` including the extension. Use `.replace(/\.mdx?$/, '')` to clean URLs. All dynamic route files already handle this.
- **Embedded HTML assets** (iframes in blog posts) live in `public/blog/...`.
- **Emoji removal script**: `python3` is available in the Docker container (`node:20-alpine` + `apk add python3`). To strip emojis from docs, run the python script via `docker compose run --rm astro python3 <script>`.
- **Mermaid in markdown**: use ` ```mermaid ` code fences. Do NOT use `pre-mermaid` class directly - the client script handles the transformation automatically.
- **`intro.md` convention**: pages named `intro.md` inside a project folder are treated specially by `DocsLayout.astro` - they appear first in the sidebar and the `Docs` sub-label appears before the remaining pages. Do not name non-intro pages `intro.md`.
- **Project `tech` field**: only set in `intro.md`, not in other pages. It is displayed on the `/projects` index as a discipline tag (e.g., History, Cybersecurity).
