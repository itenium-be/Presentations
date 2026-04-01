# Layouts

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

```markdown
---
layout: agenda
items:
  - First Topic
  - Second Topic
  - Third Topic
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

## `content-image`

Content on the left, image on the right via named slot.

```markdown
---
layout: content-image
---

# Title

- Content here

::image::

![](./images/photo.jpg)
```

## `quote`

Orange background with dot decorations. For standout quotes or transition slides.

```markdown
---
layout: quote
---

# Quote text here
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
