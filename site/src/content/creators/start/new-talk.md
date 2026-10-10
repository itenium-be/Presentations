---
title: Start a new talk
summary: Each talk is its own repo; the theme comes in as a git submodule.
order: 1
---

1. Create the repo and add the theme

   ```bash
   mkdir my-talk && cd my-talk && git init
   git submodule add https://github.com/itenium-be/Presentations.git presentation/theme
   ```

2. Scaffold: creates `presentation/slides.md` from the starter deck, `package.json`, `.gitignore` and `ElevatorPitch.md`

   ```bash
   bun run presentation/theme/scripts/scaffold.ts
   cd presentation && bun install
   ```

3. Fill in the headmatter of `presentation/slides.md`. The site reads it for the talk card.

   ```yaml
   ---
   theme: ./theme
   title: Talk Title
   subTitle: A brief subtitle
   transition: fade
   session-time: 60min
   track: Architecture          # category on the site
   type: Theoretical            # or Practical, Workshop, ...
   first: 2026-01-01            # first presentation date
   lastUpdate: 2026-06-01       # optional, shown instead of first
   aspectRatio: 16/10           # 16/10 laptop, 16/9 projector
   ---
   ```

4. Write the abstract in `ElevatorPitch.md`: the `## Abstract` section becomes the card description.

Update the theme later with `cd presentation/theme && git pull`.
