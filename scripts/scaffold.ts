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
  console.error('❌  slides/ directory already exists. Aborting.')
  process.exit(1)
}

mkdirSync(slidesDir)
console.log('✅  Created slides/')

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
console.log('✅  Created slides/package.json')

const today = new Date().toISOString().slice(0, 10)
const slidesMd = `---
theme: itenium
title: ${repoName}
speaker: Your Name
date: ${today}
---

# ${repoName}
## Subtitle

---
layout: section
---

# Section Title

---

# Slide Title

- Bullet point one
- Bullet point two
- Bullet point three

---
layout: cover
title: Thanks!
subtitle: Questions?
speaker: Your Name
date: ${today}
---
`

writeFileSync(join(slidesDir, 'slides.md'), slidesMd)
console.log('✅  Created slides/slides.md')

writeFileSync(
  join(slidesDir, '.gitignore'),
  'node_modules/\ndist/\n.slidev/\n',
)
console.log('✅  Created slides/.gitignore')

console.log('\n📦  Running bun install...')
execSync('bun install', { cwd: slidesDir, stdio: 'inherit' })

console.log(`
✨  Done! Your slides are ready.

   cd slides
   bun run dev     → start dev server
   bun run build   → build for GitHub Pages
   bun run export  → export to PDF
`)
