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

## Website

Build the full site (Astro index + all published slidev presentations):

```bash
bun run build-all
```

This clones published talk repos into `.talks-cache/`, builds each presentation, builds the Astro index, and outputs everything to `dist/`.

To serve locally:

```bash
bunx serve dist
# Open http://localhost:3000/Presentations/
```

To work on just the Astro index page:

```bash
cd site
bun install
bun run dev
```

## Layouts & Features

See [LAYOUTS.md](LAYOUTS.md) for all available layouts, features, and usage examples.

## Skills

Skills for working on slide decks live in `skills/`:

| Skill                                                          | Trigger                                                            |
|----------------------------------------------------------------|--------------------------------------------------------------------|
| [adding-slide-image](skills/adding-slide-image/SKILL.md)       | Adding an image to a slide, or converting `default` → `default-aside`. |

To make these auto-discoverable by Claude Code from a talk repo, symlink them from the talk root:

```bash
mkdir -p .claude/skills
ln -sf ../../presentation/theme/skills/adding-slide-image .claude/skills/adding-slide-image
```

Or invoke them by path: open `presentation/theme/skills/<name>/SKILL.md` in conversation.

## Creating a new presentation

Each talk lives in its own repo with the theme as a git submodule.

### Scaffold (recommended)

```bash
mkdir my-talk && cd my-talk
git init
git submodule add https://github.com/itenium-be/Presentations.git presentation/theme
bun run presentation/theme/scripts/scaffold.ts
```

This creates:
```
my-talk/
  ElevatorPitch.md   # abstract, audience, takeaways (displayed on site)
  presentation/
    theme/           # git submodule (this repo)
    slides.md        # theme: ./theme
    images/
    package.json
```

### Required frontmatter

Every `slides.md` must include these fields:

```yaml
---
theme: ./theme
title: Talk Title
subTitle: A brief subtitle
transition: fade
session-time: 60min
track: Architecture          # category shown on site (lowercase)
type: Theoretical            # or Practical, Workshop, etc.
first: 2026-01-01            # first presentation date
aspectRatio: 16/10           # 16/10 laptop, 16/9 projector, 21/9 ultrawide
---
```

Optional:

- `lastUpdate` — shown instead of `first` date on the site.

### ElevatorPitch.md

Each talk repo should have an `ElevatorPitch.md` in the repo root with this structure:

```markdown
# Talk Title

## Abstract

A brief description (2-3 sentences). Displayed as the card description on the index site.

## Target Audience

Who should attend this talk?

## Key Takeaways

- Takeaway 1
- Takeaway 2

## Session Format

45-60 minutes
```

### talks.yaml

The `talks.yaml` in this repo only tracks which talks are published:

```yaml
- repo: itenium-be/my-talk
  published: true
```

All other metadata (title, description, category, dates) comes from the talk's frontmatter and `ElevatorPitch.md`.

### Update the theme

```bash
cd presentation/theme && git pull
```

## Before presenting

- Set `aspectRatio` frontmatter
- Taskbar Settings > Taskbar behaviors > Automatically hide the taskbar
- Close DisplayFusion
