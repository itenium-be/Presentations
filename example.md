---
theme: ./
title: slidev-theme-itenium
speaker: Your Name
date: 2026-01-01
---

# slidev-theme-itenium
## The official itenium presentation theme

---
layout: default
---

# Agenda

- Cover slide
- Section divider
- Default content slide
- Two columns (code + notes)
- Live code demo (Monaco)
- Using the OrangeEllipse component

---
layout: section
---

# Default Content Slides

---
layout: default
---

# Default Layout

This is the standard content slide. It includes:

- An orange-underlined `h1` heading
- The itenium logo + page number in the footer
- Clean white background

```ts
// Code blocks look great here
const greeting = (name: string) => `Hello, ${name}!`
console.log(greeting('itenium'))
```

---
layout: default
---

# Text Styling

Use the built-in utilities:

<span class="accent">Orange accent text</span>

<div class="accent-border">
  A blockquote-style accent border — great for highlighting key points.
</div>

---
layout: section
---

# Two-Column Layouts

---
layout: two-cols-code
---

```ts
// Left column: code
function fibonacci(n: number): number {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

// First 8 Fibonacci numbers
const results = Array.from(
  { length: 8 },
  (_, i) => fibonacci(i)
)
// [0, 1, 1, 2, 3, 5, 8, 13]
```

::right::

## Right column: notes

Use this layout when you want to show code alongside an explanation.

The left column is for **code**, the right column for **notes, diagrams, or bullet points**.

- Recursive implementation
- O(2ⁿ) time complexity
- Works fine for small values of `n`

---
layout: section
---

# Live Code Demo

---
layout: demo
demoTitle: "TypeScript — Live Coding"
---

```ts {monaco}
// This is editable! Click to modify and run.
const languages = ['TypeScript', 'Rust', 'Go', 'C#']

const shout = (lang: string) => `I ❤️ ${lang}!`

languages.forEach(lang => console.log(shout(lang)))
```

---
layout: section
---

# OrangeEllipse Component

---
layout: default
---

# Using OrangeEllipse

The `OrangeEllipse` component is the signature itenium design element.  
It's automatically included on `cover` and `section` layouts.

You can also add it manually to any slide:

```vue
<OrangeEllipse side="right" />
<OrangeEllipse side="left" />
```

<OrangeEllipse side="right" />

---
layout: cover
title: Thanks!
subtitle: Questions?
speaker: Your Name
date: 2026-01-01
---
