---
title: Publish to this site
summary: List the repo in talks.yaml of the theme repo and push.
order: 2
---

Export the pptx copy from `presentation/`:

```bash
bun run export    # ../<repo>.pptx
```

The talk repo needs, in its root:

- `<repo>.pptx`
- `ElevatorPitch.md`
- `presentation/images/cover-art.{png,jpg,webp}`: the card image (2:3, 1024×1536)

Then add it to `talks.yaml` in the theme repo:

```yaml
- repo: itenium-be/my-talk
  published: true

# a second deck in the same repo: presentation/guardrails.md
- repo: itenium-be/my-talk
  entry: guardrails.md
  published: true
```

The site deploys on every push to the theme repo's `main`. To pick up changes in a talk repo only, run the *Deploy Presentations Site* workflow manually.
