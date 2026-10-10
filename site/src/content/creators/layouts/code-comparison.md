---
title: code-comparison
summary: "Before / after code"
order: 14
tags: ["before-label", "after-label", "code-size", "::before::", "::after::"]
live: { deck: showcase, slide: code-comparison }
---

Two code panels side by side, red Before and green After headings.

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
function fetchUser(id) { /* ... */ }
```

::after::

```ts
async function fetchUser(id: string): Promise<User> { /* ... */ }
```
````
