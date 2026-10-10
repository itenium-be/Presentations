---
title: code
summary: "Code slide"
order: 13
tags: ["code-size"]
live: { deck: showcase, slide: code }
---

Minimal padding, the code block fills the slide. `code-size` sets the code font size (default `0.58em`).

````markdown
---
layout: code
code-size: 1.4em
---

# Title

## Optional subtitle

```ts {1|2|3-5|all}
function isPrime(n: number): boolean {
  if (n <= 1) return false
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false
  }
  return true
}
```
````
