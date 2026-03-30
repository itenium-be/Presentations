#!/usr/bin/env bun
/**
 * Scaffold a new Slidev presentation using the itenium theme.
 *
 * From the Presentations (theme) repo:
 *   bun run scaffold /path/to/my-talk
 *
 * From the target repo (after adding submodule):
 *   git submodule add https://github.com/itenium-be/Presentations.git presentation/theme
 *   bun run presentation/theme/scripts/scaffold.ts
 */

import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, appendFileSync, readdirSync } from 'fs'
import { join, basename, resolve } from 'path'
import { execSync } from 'child_process'

// If argument provided, use it as target. Otherwise use cwd (running from target repo).
const cwd = process.argv[2] ? resolve(process.argv[2]) : process.cwd()
if (!existsSync(cwd)) {
  console.error(`Target directory does not exist: ${cwd}`)
  process.exit(1)
}

const repoName = basename(cwd)
const presDir = join(cwd, 'presentation')
const themeDir = join(presDir, 'theme')

// 1. Create presentation directory (skip if submodule was already added)
if (existsSync(presDir)) {
  console.log('presentation/ already exists (submodule added manually), skipping creation.')
} else {
  mkdirSync(presDir)
  console.log('Created presentation/')

  // 2. Add theme as submodule
  console.log('Adding theme as git submodule...')
  execSync('git submodule add https://github.com/itenium-be/presentations.git presentation/theme', {
    cwd,
    stdio: 'inherit',
  })
}

if (!existsSync(join(presDir, 'images'))) {
  mkdirSync(join(presDir, 'images'))
  console.log('Created presentation/images/')
}

// 3. Copy starter template
const starterDir = join(themeDir, 'talks', 'starter')
if (!existsSync(starterDir)) {
  console.error('Starter template not found in presentation/theme/talks/starter/. Is the theme up to date?')
  process.exit(1)
}

let starterMd = readFileSync(join(starterDir, 'slides.md'), 'utf-8')
starterMd = starterMd
  .replace('theme: ../../', 'theme: ./theme')
  .replace('title: Talk Title', `title: ${repoName}`)
writeFileSync(join(presDir, 'slides.md'), starterMd)
console.log('Created presentation/slides.md')

const starterImages = join(starterDir, 'images')
if (existsSync(starterImages)) {
  for (const file of readdirSync(starterImages)) {
    copyFileSync(join(starterImages, file), join(presDir, 'images', file))
  }
  console.log('Copied starter images/')
}

// 4. Create package.json
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
  join(presDir, 'package.json'),
  JSON.stringify(packageJson, null, 2) + '\n',
)
console.log('Created presentation/package.json')

// 5. Update .gitignore
const gitignorePath = join(cwd, '.gitignore')
const gitignoreEntries = '\n# Slidev\npresentation/node_modules/\npresentation/dist/\npresentation/.slidev/\n'
if (existsSync(gitignorePath)) {
  const existing = readFileSync(gitignorePath, 'utf-8')
  if (!existing.includes('presentation/node_modules')) {
    appendFileSync(gitignorePath, gitignoreEntries)
    console.log('Updated .gitignore')
  }
} else {
  writeFileSync(gitignorePath, gitignoreEntries.trimStart())
  console.log('Created .gitignore')
}

// 6. Update README.md
const readmePath = join(cwd, 'README.md')
const presSection = `

## Presentation

\`\`\`bash
cd presentation
bun install
bun run dev
\`\`\`

Update the theme:
\`\`\`bash
cd presentation/theme
git pull
\`\`\`
`
if (existsSync(readmePath)) {
  const existing = readFileSync(readmePath, 'utf-8')
  if (!existing.includes('## Presentation')) {
    appendFileSync(readmePath, presSection)
    console.log('Added ## Presentation to README.md')
  }
} else {
  writeFileSync(readmePath, `# ${repoName}\n${presSection}`)
  console.log('Created README.md')
}

// 7. Install
console.log('\nRunning bun install...')
execSync('bun install', { cwd: presDir, stdio: 'inherit' })

console.log(`
Done! Your slides are ready.

   cd presentation
   bun run dev     - start dev server
   bun run build   - build for GitHub Pages
   bun run export  - export to PDF

To update the theme:
   cd presentation/theme && git pull
`)
