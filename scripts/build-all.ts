#!/usr/bin/env bun
/**
 * Build the full presentations site:
 * 1. Clone published talk repos (cached in .talks-cache/)
 * 2. Build each talk's slidev presentation
 * 3. Build the Astro index site
 * 4. Copy slidev outputs into dist/presentations/{slug}/
 */

import { readFileSync, existsSync, lstatSync, readlinkSync, mkdirSync, rmSync, symlinkSync, cpSync } from 'fs'
import { join, resolve } from 'path'
import { execSync } from 'child_process'
import yaml from 'js-yaml'

interface Talk {
  title: string
  published: boolean
  description: string
  repo: string
  date: string
  category: string
}

const root = resolve(import.meta.dir, '..')
const cacheDir = join(root, '.talks-cache')
const distDir = join(root, 'dist/presentations')

const talks = yaml.load(readFileSync(join(root, 'talks.yaml'), 'utf-8')) as Talk[]
const published = talks.filter(t => t.published)

if (!existsSync(cacheDir)) mkdirSync(cacheDir)

const errors: string[] = []

function run(cmd: string, cwd: string) {
  console.log(`  $ ${cmd}`)
  execSync(cmd, { cwd, stdio: 'inherit' })
}

// 1. Clone & build each published talk
for (const talk of published) {
  const slug = talk.repo.split('/').pop()!
  const repoUrl = `https://github.com/${talk.repo}.git`
  const cloneDir = join(cacheDir, slug)
  const presDir = join(cloneDir, 'presentation')

  console.log(`\n=== ${talk.title} (${slug}) ===`)

  try {
    // Clone if not cached
    if (!existsSync(cloneDir)) {
      console.log(`Cloning ${talk.repo}...`)
      run(`git clone --depth 1 ${repoUrl} ${slug}`, cacheDir)
    } else {
      console.log('Using cached clone, pulling latest...')
      run('git pull', cloneDir)
    }

    if (!existsSync(presDir)) {
      console.error(`  ERROR: ${presDir} not found — skipping`)
      continue
    }

    // Point theme at this repo via symlink
    const themeDir = join(presDir, 'theme')
    let needsSymlink = true
    try {
      const target = readlinkSync(themeDir)
      if (target === root) needsSymlink = false
    } catch {}
    if (needsSymlink) {
      try { rmSync(themeDir, { recursive: true, force: true }) } catch {}
      try { symlinkSync(root, themeDir) } catch {}
    }

    // Clean previous build output
    const distDir2 = join(presDir, 'dist')
    if (existsSync(distDir2)) rmSync(distDir2, { recursive: true, force: true })

    // Install & build
    run('bun install', presDir)
    run(`bunx slidev build --base /presentations/${slug}/`, presDir)
  } catch (err) {
    console.error(`  FAILED: ${slug} — ${(err as Error).message}`)
    errors.push(slug)
  }
}

// 2. Build Astro index site
console.log('\n=== Building Astro site ===')
run('bun install', join(root, 'site'))
try {
  run('bun run build', join(root, 'site'))
} catch {
  // Astro build may exit non-zero due to .astro/ cleanup on WSL
  if (!existsSync(join(distDir, 'index.html'))) throw new Error('Astro build failed — no index.html produced')
  console.warn('  WARN: Astro process exited non-zero but index.html exists, continuing...')
}

// 3. Copy slidev builds into dist/presentations
const missing: string[] = []
for (const talk of published) {
  const slug = talk.repo.split('/').pop()!
  const slidevDist = join(cacheDir, slug, 'presentation', 'dist')

  if (!existsSync(slidevDist)) {
    missing.push(slug)
    console.error(`  MISSING: No dist for ${slug}`)
    continue
  }

  const targetDir = join(distDir, slug)
  if (existsSync(targetDir)) rmSync(targetDir, { recursive: true })
  cpSync(slidevDist, targetDir, { recursive: true })
  console.log(`Copied ${slug} → dist/presentations/${slug}/`)
}

if (missing.length) {
  console.error(`\nFailed: no build output for ${missing.join(', ')}`)
  process.exit(1)
}

console.log('\nDone! Full site is in dist/')
