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

## `agenda`

Numbered agenda items with photo on the left. Items passed via frontmatter.
Supports `size` frontmatter (`lg`, `md` (default), `sm`, `xs`) to fit more items.

```markdown
---
layout: agenda
size: sm
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
Supports `size` frontmatter (`lg`, `md` (default), `sm`, `xs`).

```markdown
---
layout: two-col-image-text
size: md
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

## `code`

Code-focused slide. Minimal padding, code block fills available space. Green dots bottom-left.
Supports `code-size` frontmatter to control code font size (default: `0.58em`).

```markdown
---
layout: code
code-size: 2.4em
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
