---
name: adding-slide-image
description: Use when adding an image to a slide in the itenium Slidev theme, converting a layout:default slide to layout:default-aside, or when the user says a slide "needs a picture".
---

# Adding a Slide Image

Workflow for adding a Midjourney-generated image to a slide. Covers prompt generation, image processing via the theme's resize script, and slide markup.

## When to Use

- User wants to add an image to an existing slide.
- User asks to convert `layout: default` (or a layout-less slide) to `layout: default-aside`.
- User says a slide "needs a picture" / "needs visuals" / similar.

## Layouts That Accept Images

| Layout                | Image role                       | Size               | MJ `--ar`         |
|-----------------------|----------------------------------|--------------------|-------------------|
| `default-aside`       | Circular aside (14rem, cover-crop)| 800x800            | `1:1`             |
| `cover`               | Title-slide right column (`object-fit: contain`, ~35% width, tall) | 800x1200           | `2:3`             |
| `quote-image`         | Quote backdrop (`object-fit: contain`) | 800x800 or 800x1200 | `1:1` or `2:3`    |
| `two-col-image-text`  | Left column (~half width)        | 800x800 or 800x1200 | `1:1` or `2:3`    |
| `section`             | Full-bleed background            | 1920x1200+ (out of scope) | n/a              |

`agenda` uses a theme-controlled left photo (not a per-slide slot). See `theme/LAYOUTS.md` for full layout reference.

**Rule of thumb:** layouts that `cover-crop` (default-aside) need a centered subject. Layouts that `contain` (cover, quote-image) preserve the source aspect ratio — match the slot's shape to avoid letterboxing.

## Workflow

### 1. Read the target slide

Open `presentation/slides.md`. Find the slide. Note:
- Current `layout:` (or absence).
- `# Title` and `## Subtitle` if present.
- Bullets / theme of the slide.

### 2. Pick a slug

The image filename is `./images/<slug>.jpg`. Slug rules:
- kebab-case, `a-z 0-9 -` only.
- Derived from the slide's title or core concept.
- Match the style of existing names in `presentation/images/` (e.g. `prompt-engineering.jpg`, `the-prompt.jpg`, `compaction.jpg`).
- Check the directory first to avoid collisions.

### 3. Generate Midjourney prompts

Produce **4 varied prompts**, each on a distinct stylistic axis. Each prompt should:
- Visualize the slide's **concept** metaphorically — not literal text in the image.
- Match the audience: technical talk, abstract programming concepts, professional but expressive.
- End with Midjourney parameters: `--ar <ratio> --v 7`, where `<ratio>` matches the target layout (see table above — `1:1` for `default-aside`, `2:3` for `cover`, etc).

Cover at least four of these aesthetic angles (pick the four most fitting):

- **Editorial photo** — moody, cinematic, real-world subject, shallow depth of field.
- **Isometric illustration** — clean vector, tech/architecture diagrams as art.
- **Abstract / conceptual** — shapes, light, texture; no recognizable objects.
- **Painterly** — oil or gouache feel, expressive brushwork.
- **Surreal collage** — Magritte/dada juxtaposition of ordinary objects.
- **Retro-futurist** — 70s/80s sci-fi book covers, gradients, geometric.

Present as a numbered list:

```
1. [Editorial photo] <prompt> --ar <ratio> --v 7
2. [Isometric] <prompt> --ar <ratio> --v 7
3. [Abstract] <prompt> --ar <ratio> --v 7
4. [Painterly] <prompt> --ar <ratio> --v 7
```

Ask the user to pick one or request more variants.

### 4. User generates in Midjourney

The user runs the chosen prompt externally (Discord / Midjourney web), downloads the result, and tells you the local path (e.g. `/mnt/c/Users/woute/Downloads/wouter_xyz_concept_abc.png`).

### 5. Process the image

Run from the talk repo root:

```bash
# Square (default-aside, default 800x800)
bun run presentation/theme/scripts/resize-image.ts <input-path> <slug>

# Portrait (cover layout — 2:3)
bun run presentation/theme/scripts/resize-image.ts <input-path> <slug> --width 800 --height 1200
```

Output: `presentation/images/<slug>.jpg`, smart-cropped on the subject (`fit: cover, position: attention`), quality 85, mozjpeg.

Flag reference:
- `--size N` — square shorthand, equivalent to `--width N --height N`.
- `--width N --height N` — explicit dimensions for non-square targets.

Match the dimensions to the layout from the table in §"Layouts That Accept Images".

### 6. Wire it into the slide

**Case A — slide has `layout: default` or no `layout:`:**

Change the frontmatter to `layout: default-aside`. Then append at the bottom of the slide (before the `---` separator):

```markdown
::image::

![](./images/<slug>.jpg)
```

**Case B — slide already uses an image-accepting layout:**

Just append the `::image::` block.

### 7. Confirm

- Verify the file exists at `presentation/images/<slug>.jpg`.
- Tell the user to refresh the dev server (Slidev hot-reloads slide content but not always assets — a refresh of the browser tab is enough).

## Common Mistakes

- **Wrong markdown path.** Always `./images/<slug>.jpg` (relative to `slides.md`), never `presentation/images/...` or absolute paths.
- **Off-center subject in `default-aside`.** The layout crops to a circle via `object-fit: cover`. Off-center subjects look weird. Generate prompts that put the subject in the center third.
- **Forgot to change layout.** A plain `layout: default` slide ignores `::image::` — Slidev silently drops the unused slot. Layout must be `default-aside` or another image-accepting one.
- **Slug collision.** Two slides with the same slug overwrite each other's image. Check `presentation/images/` before picking.
- **Literal text in image.** Midjourney is bad at rendering legible text — never put the slide's title or key terms in the prompt as text-to-render. Visualize the concept instead.

## Quick Reference

```bash
# default-aside (square)
bun run presentation/theme/scripts/resize-image.ts ~/Downloads/mj-output.png the-prompt

# cover (portrait 2:3)
bun run presentation/theme/scripts/resize-image.ts ~/Downloads/mj-output.png cover-art --width 800 --height 1200

# Slide edit (default -> default-aside):
# 1. Change `layout: default` -> `layout: default-aside`
# 2. Append:
#    ::image::
#
#    ![](./images/the-prompt.jpg)
```
