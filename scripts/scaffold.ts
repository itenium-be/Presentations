#!/usr/bin/env bun
/**
 * Scaffold a new Slidev presentation using the itenium theme.
 * Run from the root of your new talk repo:
 *
 *   bun run https://raw.githubusercontent.com/itenium-be/presentations/main/scripts/scaffold.ts
 *
 * This will:
 * 1. Create a presentation/ directory
 * 2. Add the theme as a git submodule
 * 3. Copy the starter template
 * 4. Install dependencies
 * 5. Update .gitignore and README.md
 */

import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, appendFileSync, readdirSync } from 'fs'
import { join, basename } from 'path'
import { execSync } from 'child_process'

const cwd = process.cwd()
const repoName = basename(cwd)
const presDir = join(cwd, 'presentation')
const themeDir = join(presDir, 'theme')

if (existsSync(presDir)) {
  console.error('presentation/ directory already exists. Aborting.')
  process.exit(1)
}

// 1. Create presentation directory
mkdirSync(presDir)
mkdirSync(join(presDir, 'images'))
console.log('Created presentation/ and presentation/images/')

// 2. Add theme as submodule
console.log('Adding theme as git submodule...')
execSync('git submodule add https://github.com/itenium-be/presentations.git presentation/theme', {
  cwd,
  stdio: 'inherit',
})

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
cd presentation && bun install
bunx slidev slides.md
\`\`\`

Update the theme:
\`\`\`bash
cd presentation/theme && git pull
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
