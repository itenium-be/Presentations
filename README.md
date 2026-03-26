# slidev-theme-itenium

Official [Slidev](https://sli.dev/) theme for itenium technical presentations.

## Features

- itenium brand colors, fonts, and logo
- Michroma heading font
- Orange ellipse decorative element (signature itenium design)
- 5 layouts: `cover`, `default`, `section`, `two-cols-code`, `demo`
- Live code execution via Monaco editor (`demo` layout)
- Auto-deploys slides to GitHub Pages via reusable workflow

## Usage in a talk repo

### 1. Scaffold (recommended)

From the root of your talk repo:

```bash
bun run https://raw.githubusercontent.com/itenium-be/presentations/main/scripts/scaffold.ts
```

This creates `slides/package.json`, `slides/slides.md`, and `slides/.gitignore`, then runs `bun install`.

### 2. Manual setup

Create `slides/package.json`:

```json
{
  "private": true,
  "scripts": {
    "dev": "slidev",
    "build": "slidev build --base /<repo-name>/",
    "export": "slidev export --format pdf"
  },
  "dependencies": {
    "@slidev/cli": "^51.0.0",
    "slidev-theme-itenium": "github:itenium-be/presentations#main"
  }
}
```

Create `slides/slides.md`:

```markdown
---
theme: itenium
title: My Talk Title
speaker: Your Name
date: 2026-01-01
---

# My Talk Title
## Subtitle
```

Run:

```bash
cd slides && bun install && bun run dev
```

## Layouts

### `cover`

The title slide. Uses dark background + OrangeEllipse.

Frontmatter:

```yaml
---
layout: cover       # (default for first slide when theme is set)
title: My Talk
subtitle: Optional subtitle
speaker: Jane Doe
date: 2026-03-15
---
```

### `default`

Standard content slide with footer.

### `section`

Section divider. Dark background + OrangeEllipse + orange vertical accent.

```markdown
---
layout: section
---

# Section Title
```

### `two-cols-code`

Two-column layout: code on left, notes on right.

```markdown
---
layout: two-cols-code
---

```ts
// left column
const x = 42
```

::right::

Right column content here.
```

### `demo`

Full-height Monaco editor for live coding.

```markdown
---
layout: demo
demoTitle: "TypeScript Demo"
---

```ts {monaco}
// editable code here
```
```

## Components

All components are globally available in slides:

| Component | Props | Usage |
|-----------|-------|-------|
| `IteniumLogo` | `variant: 'icon'\|'full'`, `theme: 'light'\|'dark'` | Renders the itenium logo |
| `SlideFooter` | `theme: 'light'\|'dark'` | Footer with page number + logo |
| `OrangeEllipse` | `side: 'left'\|'right'` | Decorative half-circle with dots |

## GitHub Actions (per talk repo)

Add `.github/workflows/slides.yml` to your talk repo:

```yaml
name: Deploy Slides
on:
  push:
    branches: [main]
    paths:
      - 'slides/**'

jobs:
  deploy:
    uses: itenium-be/presentations/.github/workflows/deploy-slides.yml@main
    permissions:
      contents: read
      pages: write
      id-token: write
```

## Local development (theme)

```bash
bun install
bun run dev   # opens example.md with live reload
```
