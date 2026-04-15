# aleph8.github.io

Personal website, blog, and project showcase - built with **Astro**, **Tailwind CSS v4**, and **Content Collections**.

## Stack

- **Astro 5+** - Static site framework with content collections
- **Tailwind CSS v4** - Utility-first CSS with native Vite plugin
- **@tailwindcss/typography** - Prose/markdown styles
- **Mermaid.js** (CDN) - Diagram rendering in posts
- **Docker + Docker Compose** - Isolated development environment
- **GitHub Actions** - CI/CD to GitHub Pages

## Features

- **Blog** (`/blog`, `/es/blog`) - Posts with cover images, author metadata, tags, and RSS feed
- **Projects** (`/projects`, `/es/projects`) - Project pages with sidebar navigation (intro + docs)
- **About** (`/about`, `/es/about`) - Author bio and context
- **Knowledge Graph** (`/graph`) - Interactive force-directed graph of all content nodes, with an embedded space-invaders-style game
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

## Content

| Directory | Purpose |
|---|---|
| `src/content/posts/` | Blog posts in Markdown/MDX (`en/` and `es/`) |
| `src/content/projects/` | Project pages organized by project name |
| `src/content/authors/` | Author JSON metadata |
| `src/content/tags/` | Tag JSON metadata |
| `public/blog/` | Static assets for posts (cover images, iframes) |
| `public/authors/` | Author avatars (served locally) |

See `AGENT.md` for full content schema and conventions.

## License
Copyright © 2026 Alejandro García Peláez.
