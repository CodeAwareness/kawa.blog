# kawa.blog

Bilingual (English / 日本語) blog for **Kawa Code**, built with [Astro](https://astro.build),
styled with Tailwind CSS v4, and deployed as a static site to **Cloudflare Pages** at
[blog.kawacode.ai](https://blog.kawacode.ai).

## Stack

- **Astro 6** — static site generator
- **Tailwind CSS v4** — styling (via `@tailwindcss/vite`)
- **MDX** — post authoring (Markdown + components)
- **@astrojs/sitemap** + **@astrojs/rss** — sitemap & per-locale feeds
- **astro-og-canvas** — branded Open Graph images generated at build time
- Built-in Astro **i18n** routing (`en` at `/`, `ja` at `/ja/`)

> **Writing style:** prefer plain Markdown (`.md`) for normal prose. Reach for MDX (`.mdx`)
> only when you need a reusable visual block (callout, comparison table, screenshot, CTA).

## Commands

| Command         | Action                                            |
| --------------- | ------------------------------------------------- |
| `pnpm install`  | Install dependencies                              |
| `pnpm dev`      | Start the dev server at `localhost:4321`          |
| `pnpm build`    | Type-check (`astro check`) and build to `./dist`  |
| `pnpm preview`  | Preview the production build locally              |

## Project structure

```
src/
  components/        Header, Footer, Logo, LanguageSwitcher, PostCard, FormattedDate
    blog/            Callout, ComparisonTable, ProductScreenshot, CTA,
                     AuthorBox, RelatedPosts, Hl  (use inside MDX)
  content/
    blog/
      en/            English posts (*.mdx)
      ja/            Japanese posts (*.mdx)
  i18n/
    ui.ts            UI strings per language
    utils.ts         Locale helpers (paths, slug parsing, translator)
  layouts/
    BaseLayout.astro Shell: <head>, SEO, hreflang, header/footer
    BlogPost.astro   Article layout
  pages/
    index.astro            English home (/)
    blog/index.astro       English post list (/blog)
    blog/[...slug].astro    English post pages (/blog/:slug)
    ja/...                  Japanese mirrors (/ja, /ja/blog, /ja/blog/:slug)
    rss.xml.js             English RSS (/rss.xml)
    ja/rss.xml.js          Japanese RSS (/ja/rss.xml)
    og/[...route].ts       Build-time OG images (/og/<lang>/<slug>.png)
    404.astro
  content.config.ts   Blog collection schema (Content Layer glob loader)
public/
  _headers            Cloudflare Pages security & cache headers
  favicon.svg
astro.config.mjs      Site URL, i18n, integrations
wrangler.toml         Cloudflare Pages output config
```

## Writing a post

Create matching files under each locale, using the **same filename** so the language switcher
links the two translations:

```
src/content/blog/en/my-post.mdx
src/content/blog/ja/my-post.mdx
```

Frontmatter:

```yaml
---
title: 'My post'
description: 'One-line summary used for SEO and cards.'
pubDate: 2026-06-07
updatedDate: 2026-06-10      # optional
author: 'Kawa Code'          # optional
tags: ['release']            # optional
heroImage: ./hero.png        # optional, relative to the .mdx file
draft: false                 # drafts are hidden in production builds
---
```

The slug comes from the filename (`my-post` → `/my-post`, `/ja/my-post`).

### Reusable post components (MDX only)

Import from `../../../components/blog/` inside an `.mdx` file:

```mdx
import Callout from '../../../components/blog/Callout.astro';
import CTA from '../../../components/blog/CTA.astro';
import Hl from '../../../components/blog/Hl.astro';

<Callout type="insight">A "Kawa Insight" box. Other types: info, tip, warning.</Callout>

<CTA lang="en" variant="beta" />   {/* variants: docs | trial | beta | context */}
```

### Brand colors & text emphasis

The palette is synced from `kawacode.ai` (`style2.css :root`) into the `@theme` tokens in
`src/styles/global.css` — brand blue `#2E9BD6`/`#007DC5`, gold `#fbb03b`/`#fcc56a`. The header
logo is `src/components/Logo.astro` (inlined from `assets/logo2.svg`).

Following the website's convention:

- `**bold**` stays **neutral** (white, weight 600) — it is *not* colored.
- `*italic*` renders in subtle brand **blue**.
- For deliberate keyword highlights, use the `<Hl>` component:

```mdx
<Hl>decision genomics</Hl>      {/* gold  — like .highlight-gold */}
<Hl c="blue">intent</Hl>         {/* blue  — like .highlight */}
```

- `ComparisonTable` — `headers` + `rows` arrays, optional `highlightColumn`
- `ProductScreenshot` — `src` (imported image) + `alt` + optional `caption`
- `AuthorBox` — `name` + optional `role` / `bio` / `avatar`
- `RelatedPosts` is rendered automatically at the foot of every post (same language, ranked by shared tags).

> The CTA links currently point at `https://kawacode.ai` placeholders — update the hrefs
> in `src/components/blog/CTA.astro` once the real docs / trial / beta pages exist.

### Social (Open Graph) images

Branded OG images are generated at build by `src/pages/og/[...route].ts` (no client JS):

- Posts → `/og/<lang>/<slug>.png`, wired into each post's `og:image` + JSON-LD automatically.
- Homepages → `/og/home/en.png`, `/og/home/ja.png`.

Fonts (Inter for Latin, IBM Plex Sans JP for Japanese) are fetched from the Fontsource API
**at build time**, so the build needs network access (Cloudflare's build runner has it).

## Deploying to Cloudflare Pages

This is a fully static site — no Astro adapter is required.

### Option A — Git integration (recommended)

1. Push this repo to GitHub/GitLab.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**.
3. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `pnpm build`
   - **Build output directory:** `dist`
   - **Environment variable:** `NODE_VERSION = 22` (or rely on `.nvmrc`)
4. After the first deploy, add the custom domain **blog.kawacode.ai** under
   **Custom domains** (Cloudflare provisions the DNS `CNAME` automatically when the
   zone `kawacode.ai` is on Cloudflare).

### Option B — Direct upload with Wrangler

```bash
pnpm build
pnpm dlx wrangler pages deploy   # uses pages_build_output_dir from wrangler.toml
```

The custom domain `blog.kawacode.ai` is configured once in the Pages project settings.
