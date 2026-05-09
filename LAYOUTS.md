# Layouts

## Frontmatter

Session metadata in the first slide's frontmatter:

```yaml
---
theme: ./theme
title: My Talk
transition: fade
session-time: 60min
track: Architecture
type: Theoretical
---
```

## `cover`

Title slide. Orange background, logo top-left, image on the right via named slot.

```markdown
---
theme: itenium
title: My Talk
transition: fade
---

# Title
# Subtitle

::image::

![](./images/cover-art.jpg)
```

## `default`

Standard content slide. White background, orange/green dot decorations, footer with slide number and favicon. Font size auto-scales based on bullet count.

## `default-aside`

Standard content slide with a circular aside image (14rem, orange border, square-cropped via `object-fit: cover`). Body text wraps around the image via float. Supports `textSize` (`xxl`, `xl`, `lg`, `md` (default), `sm`, `xs`) and `image-position` (`top-right` (default), `middle-right`).

```markdown
---
layout: default-aside
image-position: middle-right
textSize: sm
---

# Title

- Bullet that wraps around the image
- More content

::image::

![](./images/headshot.jpg)
```

Inherits the same themed tables as `default` (orange header, alternating rows, hover state). Add `class="dense"` on a wrapping div for tighter rows.

## `section`

Section divider. Full-bleed photo background with dark overlay, white title near top with decorative line. Supports subtitle slot.

```markdown
---
layout: section
---

# Section Title

::subtitle::

Optional subtitle text
```

**Per-slide background image:** override the default `theme/assets/section-bg.jpg` by setting `background:` to a filename inside `presentation/images/`. Both bare filenames and `./images/...` paths work — the layout strips the directory and looks the file up via Vite's `import.meta.glob`. Falls back to the default if the file isn't found.

```markdown
---
layout: section
background: prompt-lint-demo.png
---

# 🪿 Let's Demo
```

The dark overlay (45% black) is still applied so title text stays readable. Edit `.section-overlay` in `theme/layouts/section.vue` if you need a different opacity.

## `agenda`

Numbered agenda items with photo on the left. Items passed via frontmatter.
Supports `textSize` frontmatter (`lg`, `md` (default), `sm`, `xs`) to fit more items.

```markdown
---
layout: agenda
textSize: sm
items:
  - First Topic
  - Second Topic
  - Third Topic
  - Fourth Topic
  - Fifth Topic
---
```

## `comparison`

Two-column card layout. Use `.cols` and `.col` divs.

```markdown
---
layout: comparison
---

# Title

<div class="cols">
<div class="col">

### Left Card

- Point one
- Point two

</div>
<div class="col">

### Right Card

- Point one
- Point two

</div>
</div>
```

## `two-col-image-text`

Image on the left, content on the right. Title centered above both columns, columns vertically centered.
Supports `textSize` frontmatter (`lg`, `md` (default), `sm`, `xs`).

```markdown
---
layout: two-col-image-text
textSize: md
---

# Title

::image::

![](./images/photo.jpg)

::content::

- Content here
- More content
```

## `quote`

Orange background with dot decorations. For standout quotes or transition slides.

```markdown
---
layout: quote
---

# Quote text here
```

## `statement`

Green background with a large quote-mark SVG, attribution line, and optional circle aside image. Use for memorable one-liners that need more weight than `quote`. Supports `textSize` (`xl`, `lg`, `md` (default), `sm`, `xs`) and `image-position` (`top-right` (default), `middle-right`).

```markdown
---
layout: statement
textSize: lg
---

# The bold claim that anchors the talk

::author::

**Name Surname** — Title, Org

::image::

![](./images/headshot.jpg)
```

The `::author::` and `::image::` slots are both optional.

## `source`

Final slide of every talk. Renders "Powerpoint Source" title, a QR code, and a clickable
`github.com/<source>` link. Pass the repo as `source: org/repo` in frontmatter — both
the QR code URL and the visible link are derived from it.

```markdown
---
layout: source
source: itenium-be/MicroServices
---
```

The scaffold script auto-fills `source: itenium-be/<repo-name>` in new presentations.

## `code`

Code-focused slide. Minimal padding, code block fills available space. Green dots bottom-left.
Supports `code-size` frontmatter to control code font size (default: `0.58em`).

```markdown
---
layout: code
code-textSize: 2.4em
---

# Title

## Optional subtitle

\`\`\`ts
function isPrime(n: number): boolean {
  if (n <= 1) return false
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false
  }
  return true
}
\`\`\`
```

## `code-comparison`

Side-by-side Before/After code blocks on a gray background. Title at top, two rounded white panels with colored headings (red for Before, green for After). Supports `code-size` frontmatter (default `0.85em`) and `before-label` / `after-label` to override the column headings.

````markdown
---
layout: code-comparison
before-label: Without Skills
after-label: With Skills
code-size: 0.7em
---

# Title

::before::

```ts
function fetchUser(id) {
  // ...
}
```

::after::

```ts
async function fetchUser(id: string): Promise<User> {
  // ...
}
```
````

## Images

Images are bundled by Vite into the slidev build and shipped to the site card. Right-size them at export time — Vite does not resize for you.

### Per-surface targets

| Use                          | Aspect    | Source resolution | Fit         | File size   | Notes                                                          |
|------------------------------|-----------|-------------------|-------------|-------------|----------------------------------------------------------------|
| `cover` slot (slidev)        | **2:3**   | **1024×1536**     | `contain`   | **<300 KB** | Also shown on the site `TalkCard` (240×200, `cover` crop) — keep subject in the **vertical center third** so the card crop doesn't lose it |
| `break` slot (slidev)        | 2:3       | 1024×1536         | `cover`     | <300 KB     | Same image as cover usually; minor crop on long edge           |
| `default-aside` circle       | **1:1**   | **600×600**       | `cover`     | **<150 KB** | Cropped to square then masked to a circle; center the subject  |
| `agenda` left photo          | portrait  | 800×1200          | `cover`     | <250 KB     |                                                                |
| `section` background         | landscape | 1920×1080         | `cover`     | <400 KB     | A 45% black overlay sits on top — avoid busy detail            |
| `two-col-image-text` image   | flexible  | ≥1200 on long edge | `contain`  | <250 KB     | Whitespace-tolerant; the layout letterboxes                    |

### Format

| Format    | Use for                                                          |
|-----------|------------------------------------------------------------------|
| **PNG**   | Illustrations, screenshots, anything with sharp edges or text    |
| **WebP**  | Same as PNG/JPG with smaller files; supported by Vite + Astro    |
| **JPG**   | Photos with no transparency. Quality `85` is the sweet spot      |
| **SVG**   | Logos, diagrams, icons (already used by the theme)               |

Avoid GIFs (large + low quality). Avoid HEIC (inconsistent browser support).

### Compress before committing

Large images bloat both the slidev bundle and the static site:

```bash
# PNG quantize — usually 70-85% smaller, no visible loss
pngquant --quality=70-85 --strip --output cover.min.png cover.png

# JPG re-encode at q=85
magick photo.jpg -quality 85 -strip photo.jpg

# Convert to WebP (smallest, modern browsers)
magick cover.png -resize 1024x1536 -quality 85 cover.webp

# Square-crop + resize an aside circle source
magick portrait.jpg -resize 600x600^ -gravity center -extent 600x600 aside.jpg
```

If `cover.png` weighs more than ~500 KB, it should be re-exported.

## Components

### `VClickTable`

Table with v-click on rows. Supports HTML in cells via `v-html`.

```vue
<VClickTable
  :headers="['Defense', 'Approach', 'Solves it?']"
  :rows="[
    ['<b>Constitutional AI</b>', 'Self-critique against principles', 'No'],
    ['<b>Instruction Hierarchy</b>', 'Privilege tiers', 'No'],
    ['<b>Prompt Shields</b>', 'Pattern scanning', 'No'],
  ]"
  :firstVisible="1"
  size="sm"
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `headers` | `string[]` | required | Column headers |
| `rows` | `string[][]` | required | Row data (supports HTML) |
| `firstVisible` | `number` | `1` | Rows visible immediately |
| `textSize` | `lg` \| `md` \| `sm` | `md` | `sm` applies dense styling |
| `separatorBefore` | `number[]` | `[]` | Row indices (0-based) with orange border-top |

## Utility Classes

### `full-width`

Breaks out of the default layout's content padding to span the full slide width. Text is centered.

```markdown
---
layout: default
---

# My Slide

<div class="full-width text-xxl italic text-orange-400">
  A quote that spans the entire width of the slide.
</div>
```

## Title Decorations

Add code-inspired decorations to h1/h2 via frontmatter:

```yaml
h1:
  type: dot
  color: primary
  position: end
h2:
  type: brackets
  color: muted
  position: 2-3
```

| Type | Symbols | Position | Colors |
|------|---------|----------|--------|
| `dot` | `.` | end (default) | primary, muted |
| `slashes` | `.//` | end (default) | primary, muted |
| `hash` | `#` | start (default) | primary, muted |
| `semicolon` | `;` | start (default), end | muted only |
| `brackets` | `[ ]` | all (default), word range | primary, muted |
| `braces` | `{ }` | all (default), word range | primary, muted |

**Position values:**
- `start` / `end` — prepend or append the symbol
- `all` — wrap entire title (brackets/braces only)
- `2` or `2-3` — wrap word(s) at position (brackets/braces only, 1-indexed)

**Color values:** `primary` (orange) or `muted` (gray)

```markdown
---
layout: default
h1:
  type: braces
  color: primary
  position: 2
---

# What is UnitTesting
```

Renders as: What is **{**UnitTesting**}**

## Features

### Click-to-reveal

Wrap lists in `<v-clicks>` to reveal items on click:

```markdown
<v-clicks depth="2">

- First item
- Second item
  - Sub-item (also needs click with depth="2")

</v-clicks>
```

### Speaker notes

Add HTML comments at the end of a slide:

```markdown
# My Slide

Content here

<!-- These notes are only visible in presenter mode -->
```

### Live code

Use `{monaco-run}` for editable + runnable code blocks:

````markdown
```ts {monaco-run}
const x = 42
console.log(x)
```
````
