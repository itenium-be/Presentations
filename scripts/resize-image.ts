#!/usr/bin/env bun
/**
 * Resize an image (smart-crop, cover), compress as JPEG,
 * and write to the talk's presentation/images/<slug>.jpg.
 *
 * Usage (run from the talk repo root):
 *   bun run presentation/theme/scripts/resize-image.ts <input-path> <slug>
 *   bun run presentation/theme/scripts/resize-image.ts <input-path> <slug> --size 800
 *   bun run presentation/theme/scripts/resize-image.ts <input-path> <slug> --width 800 --height 1200
 *
 * Defaults: 800x800 square (matches `default-aside` circular crop).
 * For `cover` layout (portrait), use --width 800 --height 1200 (2:3).
 *
 * Quality 85, mozjpeg, smart-crop on subject ('attention').
 */

import sharp from 'sharp'
import { existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

function flag(args: string[], name: string): string | undefined {
  const i = args.indexOf(name)
  return i >= 0 ? args[i + 1] : undefined
}

const args = process.argv.slice(2)
const sizeArg = flag(args, '--size')
const widthArg = flag(args, '--width')
const heightArg = flag(args, '--height')

const width = Number(widthArg ?? sizeArg ?? 800)
const height = Number(heightArg ?? sizeArg ?? 800)

const positional = args.filter(a => !a.startsWith('--') && !args[args.indexOf(a) - 1]?.startsWith('--'))
const [input, slug] = positional

if (!input || !slug) {
  console.error('Usage: bun run resize-image.ts <input-path> <slug> [--size N | --width N --height N]')
  process.exit(1)
}
if (!existsSync(input)) {
  console.error(`Input not found: ${input}`)
  process.exit(1)
}
if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  console.error(`Slug must be kebab-case (a-z, 0-9, -). Got: ${slug}`)
  process.exit(1)
}
if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
  console.error(`Invalid dimensions: ${width}x${height}`)
  process.exit(1)
}

const outDir = resolve(process.cwd(), 'presentation/images')
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })
const outPath = resolve(outDir, `${slug}.jpg`)

await sharp(input)
  .resize(width, height, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 85, mozjpeg: true })
  .toFile(outPath)

console.log(`Wrote ${outPath} (${width}x${height})`)
