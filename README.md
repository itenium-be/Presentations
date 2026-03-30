# slidev-theme-itenium

Official [Slidev](https://sli.dev/) theme for itenium technical presentations.

## Quick start

```bash
bun install

# Presentation with everything that is in the theme
bunx slidev talks/showcase/slides.md

# Presentation with code examples in ts, c# etc
bunx slidev talks/rosetta/slides.md
```

Presenter mode: `http://localhost:3030/presenter`

## Layouts & Features

See [LAYOUTS.md](LAYOUTS.md) for all available layouts, features, and usage examples.

## Using the theme in a talk repo

Each talk lives in its own repository. Add `slidev-theme-itenium` as a dependency:

```json
{
  "dependencies": {
    "@slidev/cli": "^51.0.0",
    "slidev-theme-itenium": "github:itenium-be/presentations"
  },
  "scripts": {
    "dev": "slidev",
    "build": "slidev build --base /<repo-name>/"
  }
}
```

In your `slides.md`:

```markdown
---
theme: itenium
title: My Talk
transition: fade
---

# My Talk Title
```

Theme changes are picked up when you `bun install` / `bun update` in the talk repo.

## Local theme development

```bash
bun install
bunx slidev example.md
```
