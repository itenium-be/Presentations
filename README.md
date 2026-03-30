Presentations
=============

Official [Slidev](https://sli.dev/) theme for itenium technical presentations.

## Quick start

```bash
bun install

# Showcase with all theme features
bunx slidev talks/showcase/slides.md

# Presentation with code examples in ts, c# etc
bunx slidev talks/rosetta/slides.md

# Minimal starter template
bunx slidev talks/starter/slides.md
```

Presenter mode: `http://localhost:3030/presenter`

## Layouts & Features

See [LAYOUTS.md](LAYOUTS.md) for all available layouts, features, and usage examples.

## Creating a new presentation

Each talk lives in its own repo with the theme as a git submodule.

### Scaffold (recommended)

```bash
cd talks
mkdir my-talk && cd my-talk
git init
bun run https://raw.githubusercontent.com/itenium-be/presentations/main/scripts/scaffold.ts
```

This creates:
```
my-talk/
  theme/          # git submodule (this repo)
  slides.md       # theme: ./theme
  images/
  package.json
```

### Update the theme

```bash
cd theme && git pull
```
