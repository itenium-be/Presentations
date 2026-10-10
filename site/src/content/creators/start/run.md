---
title: Run, present & export
summary: Hot-reloading dev server, presenter mode and the pptx copy.
order: 2
---

```bash
cd presentation
bun run dev       # http://localhost:3030 · /presenter for notes + timer
bun run export    # ../<repo>.pptx, needed to publish
```

Before presenting:

- Set `aspectRatio` to the projector (16/9 vs 16/10)
- Windows: auto-hide the taskbar
- Close DisplayFusion
