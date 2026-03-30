#!/usr/bin/env bun
/**
 * Scaffold Slidev slides into the current talk repo.
 * Run from the root of any itenium talk repo:
 *
 *   bun run https://raw.githubusercontent.com/itenium-be/presentations/main/scripts/scaffold.ts
 */

import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join, basename } from 'path'
import { execSync } from 'child_process'

const cwd = process.cwd()
const repoName = basename(cwd)
const slidesDir = join(cwd, 'slides')

if (existsSync(slidesDir)) {
  console.error('slides/ directory already exists. Aborting.')
  process.exit(1)
}

mkdirSync(slidesDir)
mkdirSync(join(slidesDir, 'images'))
console.log('Created slides/ and slides/images/')

const packageJson = {
  private: true,
  scripts: {
    dev: 'slidev',
    build: `slidev build --base /${repoName}/`,
    export: 'slidev export --format pdf',
  },
  dependencies: {
    '@slidev/cli': '^51.0.0',
    'slidev-theme-itenium': 'github:itenium-be/presentations#main',
  },
}

writeFileSync(
  join(slidesDir, 'package.json'),
  JSON.stringify(packageJson, null, 2) + '\n',
)
console.log('Created slides/package.json')

const today = new Date().toISOString().slice(0, 10)
const slidesMd = `---
theme: itenium
title: ${repoName}
transition: fade
---

# ${repoName}
# Your Subtitle Here

---
layout: agenda
items:
  - The Problem
  - The Solution
  - Live Demo
  - Lessons Learned
---

---
layout: section
---

# The Problem

::subtitle::

Why we can't have nice things

---
layout: default
---

# The Current State of Affairs

- Everything is on fire
- The tests pass locally but not in CI
- "It works on my machine" is not a deployment strategy
- The intern pushed to main

<!-- Speaker note: pause for dramatic effect -->

---
layout: default
---

# Root Cause Analysis

<v-clicks>

- Someone disabled the linter "temporarily" in 2019
- The database schema was designed on a napkin
- We have 47 microservices for a TODO app
- The documentation says "TODO: write documentation"

</v-clicks>

---
layout: section
---

# The Solution

::subtitle::

It's not another framework. Or is it?

---
layout: content-image
---

# Architecture Overview

- Step 1: Delete node_modules
- Step 2: Turn it off and on again
- Step 3: Blame DNS
- Step 4: Actually read the error message

::image::

![](https://picsum.photos/800/600?random=1)

---
layout: comparison
---

# Before vs After

<div class="cols">
<div class="col">

### Before

- 3 hour build times
- "Works on my machine"
- Manual deployments on Fridays
- Hope-driven development

</div>
<div class="col">

### After

- 3 minute builds
- "Works in containers"
- Automated CI/CD
- Test-driven confidence

</div>
</div>

---
layout: quote
---

# First, solve the problem.
# Then, write the code.

---
layout: section
---

# Live Demo

::subtitle::

Pray to the demo gods

---
layout: default
---

# Interactive Code

\`\`\`ts {monaco-run}
interface Bug {
  id: number
  title: string
  severity: 'low' | 'medium' | 'critical' | 'the-building-is-on-fire'
}

const bugs: Bug[] = [
  { id: 1, title: 'CSS is hard', severity: 'critical' },
  { id: 2, title: 'Off by one error', severity: 'the-building-is-on-fire' },
  { id: 3, title: 'Typo in variable name', severity: 'low' },
]

const panic = bugs.filter(b => b.severity === 'the-building-is-on-fire')
console.log(\`Bugs requiring panic: \${panic.length}\`)
console.log(panic.map(b => b.title).join(', '))
\`\`\`

---
layout: section
---

# Lessons Learned

::subtitle::

What we broke along the way

---
layout: default
---

# Key Takeaways

<v-clicks depth="2">

- Always have a rollback plan
  - \`git revert\` is your friend
  - Database migrations should be reversible
- Automate everything you do twice
  - If you do it three times without automating, you owe the team coffee
- Write tests before you need them
  - Future you will mass high fives

</v-clicks>

---
layout: quote
---

# Questions?
`

writeFileSync(join(slidesDir, 'slides.md'), slidesMd)
console.log('Created slides/slides.md')

writeFileSync(
  join(slidesDir, '.gitignore'),
  'node_modules/\ndist/\n.slidev/\n',
)
console.log('Created slides/.gitignore')

console.log('\nRunning bun install...')
execSync('bun install', { cwd: slidesDir, stdio: 'inherit' })

console.log(`
Done! Your slides are ready.

   cd slides
   bun run dev     - start dev server
   bun run build   - build for GitHub Pages
   bun run export  - export to PDF
`)
