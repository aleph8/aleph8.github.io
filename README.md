# aleph8.github.io

Personal website, blog, and project showcase - built with **Astro**, **Tailwind CSS v4**, and **Content Collections**.

## Stack

- **Astro 7+** - Static site framework with content collections
- **Tailwind CSS v4** - Utility-first CSS with native Vite plugin
- **@tailwindcss/typography** - Prose/markdown styles
- **Mermaid.js** (self-hosted) - Diagram rendering in posts without runtime CDN access
- **Docker + Docker Compose** - Isolated development environment
- **GitHub Actions** - CI/CD to GitHub Pages

## Features

- **Articles** (`/blog`, `/en/blog`) - Projects, experiments, and practical writing
- **Reflections** (`/microensayos`, `/en/microessays`) - Typographic 2:3 covers and a continuous/paginated ebook reader
- **Questions** (`/preguntas`, `/en/questions`) - Open, under-investigation, or answered knowledge nodes
- **Projects** (`/projects`, `/en/projects`) - Project pages with sidebar navigation (intro + docs)
- **About** (`/about`, `/en/about`) - Author bio and context
- **Knowledge tree** (`/graph`) - Explicit directed relationships with search, type filters, and a time slider
- **i18n** - Full English / Spanish support with automatic alternate routes
- **Grid background** - Subtle graph-paper grid on all pages; content pages float as white "paper" over it
- **No dark mode** - Pure white always

## Development

Runs entirely in Docker - no local Node.js required.

```bash
# Start dev server (http://localhost:4321)
docker compose up -d

# Install a new package
docker compose run --rm astro npm install <package>

# Production build
docker compose run --rm astro npm run build

# View logs
docker compose logs -f astro
```

## Embedded Lifelike viewer

Import `src/components/LifelikeVisor.astro` into any Astro page or MDX document:

```astro
---
import LifelikeVisor from '../components/LifelikeVisor.astro';
---

<LifelikeVisor lang="en" pattern="replicator" autoplay />
```

Adjust the import path to match the document location. Each instance has its own
board, controls, and timer. Optional props are `lang`, `pattern`, `rule`, `width`,
`height`, `interval` (milliseconds), `autoplay`, and `fullViewport`. Defaults are Spanish,
Replicator/HighLife, a 64 × 48 board, 120 ms per generation, and paused playback.
Autoplay respects the browser's reduced-motion preference.

`<LifelikeVisor fullViewport />` fills the viewport with a compact toolbar and a
board covering all remaining space. The standalone routes `/lifelike` and
`/en/lifelike` include a home link. This mode adapts the universe dimensions to
the available area, keeping cells approximately 10 CSS pixels across. Resizing
recenters existing cells and preserves the generation and playback state; cells
outside a smaller board are cropped. It starts paused.

Changing a pattern selects its suggested rule; the rule selector can then override
it. The compact toolbar includes independent grid and information toggles, both
off by default. Information appears over the board. The viewer fits the available
viewport height while preserving square cells. Embedded sizing depends on the
container and viewport, not the content above the viewer. The viewer uses the current matrix universe API through `src/lib/lifelike.ts`.
This module isolates WASM loading from rendering so other universe implementations
can be integrated later.

The official `v0.1.0` release files are checked into `public/lifelike/v0.1.0/`,
including the MIT license and upstream checksums. They are served locally in both
development and production; no GitHub requests are needed at runtime.

## Content

| Directory | Purpose |
|---|---|
| `src/content/posts/` | Blog posts in Markdown/MDX (`en/` and `es/`) |
| `src/content/projects/` | Project pages organized by project name |
| `src/content/authors/` | Author JSON metadata |
| `src/content/tags/` | Tag JSON metadata |
| `src/content/branches/` | Nested knowledge branches in JSON |
| `public/blog/` | Static assets for posts (cover images, iframes) |
| `public/authors/` | Author avatars (served locally) |

Drafts never receive production routes or appear in RSS. Aleph Vault's isolated
preview sets `ALEPH_PREVIEW_DRAFTS=1` so drafts can be reviewed locally.

Articles, reflections, and questions remain in the same `posts` collection and
are selected by the `type` field. A new Spanish draft needs only a title:

```bash
npm run article -- "Title"
npm run microessay -- "Title"
npm run question -- "Question?"
```

Relationships are authored once on the canonical Spanish document. English
translations inherit them, and inverse links are generated during the build.
The general RSS feed excludes questions; dedicated feeds live under `/rss/`.

Each post may point to one leaf with `branch: cryptography`. Branch definitions
use `parentBranch` to form an arbitrarily deep hierarchy; a branch without a
parent grows directly from the virtual Knowledge root. The graph derives all
branch ancestry automatically, so moving a complete topic only requires
changing its branch definition.

Branch IDs and `parentBranch` remain language-neutral. A branch keeps its
canonical Spanish label and can provide the English presentation without
duplicating the taxonomy:

```json
{
  "title": "Seguridad",
  "translations": {
    "en": { "title": "Security" }
  }
}
```

See `AGENT.md` for full content schema and conventions.

## License
Copyright © 2026 Alejandro García Peláez.
