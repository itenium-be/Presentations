# Slidev Presentation Setup Plan

## Problem
Each talk lives in its own GitHub repo (`itenium-be/git-how-to-get-out-of-a-mess`, etc.) alongside code, tests, memes, etc.  
The slides (previously PPTX at repo root) should be source-control-friendly, support live code execution, and share itenium's visual identity.

## Decisions Made
- **Theme name**: `slidev-theme-itenium`
- **Org**: `itenium-be`
- **Theme distribution**: GitHub URL reference (`github:itenium-be/presentations#v1.0.0`) — no npm publish needed
- **Slides location in talk repos**: `slides/` subfolder
- **Aspect ratio**: 16:9
- **Brand**: orange `#e84700`, dark gray `#343434`, white `#FEFEFE`, font: Michroma (TTF in marketing repo)
- **Index site**: Astro, hosted in this repo, deployed to GitHub Pages
- **Talk registry**: manually maintained YAML/JSON file in this repo

---

## Part 1 — Slidev Theme (this repo: `presentations`)

Package name: `slidev-theme-itenium`

### Structure
```
presentations/
├── package.json              # name: "slidev-theme-itenium", no publish needed
├── theme.config.ts           # Slidev theme config
├── layouts/
│   ├── default.vue           # standard content slide
│   ├── cover.vue             # title/intro slide: dark bg, OrangeEllipse, white logo+text
│   ├── section.vue           # section divider with orange accent + ellipse
│   ├── two-cols-code.vue     # code left + notes right
│   └── demo.vue              # full-screen live code (Monaco)
├── components/
│   ├── IteniumLogo.vue       # renders logo SVG, prop: variant (icon|full), theme (light|dark)
│   ├── SlideFooter.vue       # page number + small icon logo
│   └── OrangeEllipse.vue     # decorative half-circle with orange dots
├── styles/
│   └── index.css             # CSS vars: brand colors, Michroma font-face
├── assets/
│   ├── Michroma.ttf                              # from itenium-be/marketing Logos/Font
│   ├── logo-icon-white.svg                       # ultra_small_logo_brackets_white_dot.svg
│   ├── logo-icon-gray.svg                        # ultra_small_logo_brackets_gray_dot.svg
│   ├── logo-full-white.svg                       # itenium_logo_white-text.svg
│   ├── logo-full-gray.svg                        # itenium_logo_gray-text.svg
│   └── orange-ellipse.svg                        # from https://itenium.be/wp-content
├── example.md                # demo deck showing all layouts
└── README.md
```

### Brand
- Primary: `#e84700` (orange)
- Dark bg: `#343434` (dark gray)  
- Text/bg: `#FEFEFE` (near-white)
- Font: Michroma (headings), system sans-serif (body)
- Logos: icon-only (white/gray variants), full logo with text (white/gray variants) — all SVG
- Decorative element: half-circle with orange dots column (`orange-ellipse.svg`)
- Cover: dark background (`#343434`), white logo variant, OrangeEllipse

---

## Part 2 — Per-Talk Scaffolding

Each talk repo gets a `slides/` folder with 3 files:

```
my-talk-repo/
├── slides/
│   ├── package.json   # ~8 lines
│   ├── slides.md      # content only
│   └── .gitignore
├── Examples/
└── ...
```

`slides/package.json`:
```json
{
  "private": true,
  "scripts": {
    "dev": "slidev",
    "build": "slidev build --base /repo-name/",
    "export": "slidev export --format pdf"
  },
  "dependencies": {
    "@slidev/cli": "latest",
    "slidev-theme-itenium": "github:itenium-be/presentations#main"
  }
}
```

`slides.md` starter:
```markdown
---
theme: itenium
title: Talk Title
---

# Talk Title
## subtitle

---

# Agenda
...
```

### Scaffold script (`scripts/scaffold.ts`)
Run from any talk repo root:
```bash
bun run github:itenium-be/presentations/scripts/scaffold.ts
```
Creates `slides/`, writes the 3 files, runs `bun install`.

---

## Part 3 — GitHub Actions (per talk repo)

A reusable workflow file (stored in this repo, referenced from talk repos):

```yaml
# .github/workflows/slides.yml  (in each talk repo)
on: [push]
jobs:
  deploy:
    uses: itenium-be/presentations/.github/workflows/deploy-slides.yml@main
```

The reusable workflow:
1. `bun install` in `slides/`
2. `bun run build`
3. Deploy to GitHub Pages at `https://itenium-be.github.io/<repo-name>/`

---

## Part 4 — Talks Index Site (Astro)

Hosted in this repo at `https://itenium-be.github.io/presentations/`

### Structure
```
presentations/
├── site/                     # Astro project
│   ├── src/
│   │   ├── pages/index.astro # card grid of all talks
│   │   └── components/TalkCard.astro
│   ├── astro.config.mjs
│   └── package.json
└── talks.yaml                # registry: title, description, repo, date, tags
```

`talks.yaml` entry:
```yaml
- title: "Git: How to Get Out of a Mess"
  description: "Practical strategies for fixing Git disasters"
  repo: itenium-be/git-how-to-get-out-of-a-mess
  slides_url: https://itenium-be.github.io/git-how-to-get-out-of-a-mess/
  date: 2024-03-15
  tags: [git, devtools]
```

### GitHub Actions
Push to `main` → build Astro site → deploy to GitHub Pages.

---

## Todos (ordered)

### Phase 1: Theme Assets
1. Download and commit assets: `Michroma.ttf` (marketing repo), 4 logo SVGs — `logo-icon-white.svg`, `logo-icon-gray.svg`, `logo-full-white.svg`, `logo-full-gray.svg` (from marketing Logos/Logos), `orange-ellipse.svg` (itenium.be)
2. Create `styles/index.css`: CSS vars + `@font-face` for Michroma

### Phase 2: Components
3. Create `IteniumLogo.vue` — renders logo SVG, props: `variant` (icon|full), `theme` (light|dark)
4. Create `SlideFooter.vue` — slide number + small icon logo, shown on all content slides
5. Create `OrangeEllipse.vue` — the half-circle with orange dots column, positioned absolute on left or right edge

### Phase 3: Layouts
6. Create `cover.vue` — dark bg (`#343434`), `OrangeEllipse` on right, full white logo top-left, title/subtitle/speaker frontmatter
7. Create `default.vue` — standard content with `SlideFooter`
8. Create `section.vue` — section divider, `OrangeEllipse` on right, orange accent
9. Create `two-cols-code.vue` — left column code, right column notes
10. Create `demo.vue` — full-screen Monaco live code area

### Phase 4: Example & Docs
11. Write `example.md` — showcases every layout, live code execution, OrangeEllipse placement options
12. Write `README.md` — usage, layout reference, frontmatter options

### Phase 5: Scaffolding
13. Write `scripts/scaffold.ts` — creates `slides/` dir with `package.json`, starter `slides.md`, `.gitignore`, runs `bun install`
14. Write `.github/workflows/deploy-slides.yml` — reusable workflow: bun install → build → GitHub Pages

### Phase 6: Index Site
15. Initialize Astro project in `site/`
16. Create `talks.yaml` registry
17. Build `TalkCard.astro` component
18. Build `index.astro` page (card grid, sorted by date)
19. Configure GitHub Actions for Astro deploy → `itenium-be.github.io/presentations/`

---

## Open Questions
- ~~Logo format~~ → SVG, 4 variants (icon/full × white/gray)
- ~~Cover background~~ → dark `#343434` with OrangeEllipse decoration
