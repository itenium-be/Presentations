---
title: Edit these docs
summary: This page, Showcase and Rosetta all hot reload locally.
order: 3
---

From the theme repo:

```bash
bun run dev:creators
```

| What     | URL                                          | Source                                  |
|----------|----------------------------------------------|-----------------------------------------|
| Docs     | http://localhost:4321/Presentations/creators/ | `site/src/content/creators/**/*.md`     |
| Showcase | http://localhost:3030                         | `talks/showcase/slides.md`              |
| Rosetta  | http://localhost:3031                         | `talks/rosetta/slides.md`               |

A doc links to its live slide via `live: { deck, slide }` in its frontmatter, matching a `routeAlias:` on that slide. `bun test` fails when a layout has no doc or a live link points nowhere.
