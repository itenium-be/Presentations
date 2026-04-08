#!/usr/bin/env bun
/**
 * Build the full presentations site:
 * 1. Clone published talk repos (cached in .talks-cache/)
 * 2. Build each talk's slidev presentation
 * 3. Build the Astro index site
 * 4. Copy slidev outputs into dist/presentations/{slug}/
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, cpSync } from 'fs'
import { join, resolve } from 'path'
import { execSync } from 'child_process'
import yaml from 'js-yaml'

interface Talk {
  repo: string
  published: boolean
}

const root = resolve(import.meta.dir, '..')
const cacheDir = join(root, '.talks-cache')
const distDir = join(root, 'dist/Presentations')

const talks = yaml.load(readFileSync(join(root, 'talks.yaml'), 'utf-8')) as Talk[]
const published = talks.filter(t => t.published)

if (!existsSync(cacheDir)) mkdirSync(cacheDir)
if (existsSync(join(root, 'dist'))) rmSync(join(root, 'dist'), { recursive: true })

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

  console.log(`\n=== ${slug} ===`)

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

    // Copy theme into presentation dir (symlinks break Vite's fs.allow)
    // Cannot cpSync root → themeDir directly because .talks-cache is inside root
    const themeDir = join(presDir, 'theme')
    if (existsSync(themeDir)) rmSync(themeDir, { recursive: true, force: true })
    mkdirSync(themeDir, { recursive: true })
    const themeDirs = ['assets', 'components', 'layouts', 'setup', 'styles']
    const themeFiles = ['package.json', 'custom-nav-controls.vue', 'global-top.vue']
    for (const d of themeDirs) cpSync(join(root, d), join(themeDir, d), { recursive: true })
    for (const f of themeFiles) cpSync(join(root, f), join(themeDir, f))

    // Clean previous build output
    const distDir2 = join(presDir, 'dist')
    if (existsSync(distDir2)) rmSync(distDir2, { recursive: true, force: true })

    // Install & build
    run('bun install', presDir)
    run('bun add -D playwright-chromium', presDir)
    run(`bunx slidev build --base /Presentations/${slug}/`, presDir)

    // Export PPTX (non-fatal — requires system deps for Chromium)
    try {
      run(`bunx slidev export --format pptx --output ${slug}.pptx`, presDir)
    } catch {
      console.warn(`  WARN: PPTX export failed for ${slug} (missing system deps for Playwright?)`)
    }
  } catch (err) {
    console.error(`  FAILED: ${slug} — ${(err as Error).message}`)
    errors.push(slug)
  }
}

// 2. Copy theme fonts + assets into site/public for the Astro build
console.log('\n=== Copying theme assets to site/public ===')
const sitePublic = join(root, 'site', 'public')
mkdirSync(join(sitePublic, 'fonts'), { recursive: true })
for (const f of ['rubik-400', 'rubik-500', 'rubik-700', 'inter-400', 'inter-600', 'ibm-plex-mono-400']) {
  cpSync(join(root, 'assets', 'fonts', `${f}.woff2`), join(sitePublic, 'fonts', `${f}.woff2`))
}
cpSync(join(root, 'assets', 'dots-orange.png'), join(sitePublic, 'dots-orange.png'))
cpSync(join(root, 'assets', 'logo-itenium.svg'), join(sitePublic, 'logo-itenium.svg'))

// 3. Build Astro index site
console.log('\n=== Building Astro site ===')
run('bun install', join(root, 'site'))
try {
  run('bun run build', join(root, 'site'))
} catch {
  // Astro build may exit non-zero due to .astro/ cleanup on WSL
  if (!existsSync(join(distDir, 'index.html'))) throw new Error('Astro build failed — no index.html produced')
  console.warn('  WARN: Astro process exited non-zero but index.html exists, continuing...')
}

// 4. Copy slidev builds into dist/Presentations
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

  // Copy cover image to a predictable path
  const imgDir = join(cacheDir, slug, 'presentation', 'images')
  for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
    const src = join(imgDir, `cover-art.${ext}`)
    if (existsSync(src)) { cpSync(src, join(targetDir, `cover-art.${ext}`)); break }
  }

  // Copy PPTX if exported
  const pptxSrc = join(cacheDir, slug, 'presentation', `${slug}.pptx`)
  if (existsSync(pptxSrc)) {
    cpSync(pptxSrc, join(targetDir, `${slug}.pptx`))
    console.log(`  Copied ${slug}.pptx`)
  } else {
    console.warn(`  WARN: No PPTX for ${slug}`)
  }

  // Inject SPA redirect restore script into each talk's index.html
  const indexPath = join(targetDir, 'index.html')
  const html = readFileSync(indexPath, 'utf-8')
  const spaScript = `<script>(function(){var r=sessionStorage.redirect;delete sessionStorage.redirect;if(r&&r!==location.href){history.replaceState(null,null,r)}})()</script>`
  writeFileSync(indexPath, html.replace('<head>', '<head>' + spaScript))

  console.log(`Copied ${slug} → dist/Presentations/${slug}/`)
}

if (missing.length) {
  console.error(`\nFailed: no build output for ${missing.join(', ')}`)
  process.exit(1)
}

// 5. Write root 404.html for SPA routing on GitHub Pages
const notFoundHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><script>
// Preserve SPA path through GitHub Pages 404 redirect
sessionStorage.redirect = location.href;
var m = location.pathname.match(/^\\/Presentations\\/[^/]+\\//);
if (m) location.replace(m[0]);
</script></head><body></body></html>`
writeFileSync(join(distDir, '404.html'), notFoundHtml)

console.log('\nDone! Full site is in dist/')
