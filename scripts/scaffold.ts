#!/usr/bin/env bun
/**
 * Scaffold a new Slidev presentation using the itenium theme.
 * Run from the root of your new talk repo:
 *
 *   bun run https://raw.githubusercontent.com/itenium-be/presentations/main/scripts/scaffold.ts
 *
 * This will:
 * 1. Add the theme as a git submodule
 * 2. Copy the starter template
 * 3. Install dependencies
 */

import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'fs'
import { join, basename } from 'path'
import { execSync } from 'child_process'

const cwd = process.cwd()
const repoName = basename(cwd)
const themeDir = join(cwd, 'theme')
const slidesFile = join(cwd, 'slides.md')

if (existsSync(slidesFile)) {
  console.error('slides.md already exists. Aborting.')
  process.exit(1)
}

// 1. Add theme as submodule
if (!existsSync(themeDir)) {
  console.log('Adding theme as git submodule...')
  execSync('git submodule add https://github.com/itenium-be/presentations.git theme', {
    cwd,
    stdio: 'inherit',
  })
} else {
  console.log('Theme directory already exists, skipping submodule.')
}

// 2. Copy starter template
const starterDir = join(themeDir, 'talks', 'starter')
if (!existsSync(starterDir)) {
  console.error('Starter template not found in theme/talks/starter/. Is the theme up to date?')
  process.exit(1)
}

// Copy and adjust slides.md (change theme path)
let starterMd = readFileSync(join(starterDir, 'slides.md'), 'utf-8')
starterMd = starterMd
  .replace('theme: ../../', 'theme: ./theme')
  .replace('title: Talk Title', `title: ${repoName}`)
writeFileSync(slidesFile, starterMd)
console.log('Created slides.md')

// Copy images
mkdirSync(join(cwd, 'images'), { recursive: true })
const starterImages = join(starterDir, 'images')
if (existsSync(starterImages)) {
  const { readdirSync } = await import('fs')
  for (const file of readdirSync(starterImages)) {
    copyFileSync(join(starterImages, file), join(cwd, 'images', file))
  }
  console.log('Copied starter images/')
}

// 3. Create package.json
const packageJson = {
  private: true,
  scripts: {
    dev: 'slidev',
    build: `slidev build --base /${repoName}/`,
    export: 'slidev export --format pdf',
  },
  dependencies: {
    '@slidev/cli': '^51.0.0',
  },
}

writeFileSync(
  join(cwd, 'package.json'),
  JSON.stringify(packageJson, null, 2) + '\n',
)
console.log('Created package.json')

// 4. Create .gitignore
writeFileSync(
  join(cwd, '.gitignore'),
  'node_modules/\ndist/\n.slidev/\n',
)
console.log('Created .gitignore')

// 5. Install
console.log('\nRunning bun install...')
execSync('bun install', { cwd, stdio: 'inherit' })

console.log(`
Done! Your slides are ready.

   bun run dev     - start dev server
   bun run build   - build for GitHub Pages
   bun run export  - export to PDF

To update the theme:
   cd theme && git pull
`)
